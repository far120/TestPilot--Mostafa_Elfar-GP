

import { useCallback, useEffect, useRef, useState } from 'react'
import { wsUrl } from '../api/client.js'


const CONFIG_SEND_TIMEOUT_MS = 900

export function useRunWebSocket(testCaseId, onFinished) {
  const socketRef   = useRef( (null))
  const onFinishedRef = useRef(onFinished)

  // Keep the callback ref current without re-creating the hook
  useEffect(() => { onFinishedRef.current = onFinished }, [onFinished])

  const [isRunning,  setIsRunning]  = useState(false)
  const [events,     setEvents]     = useState(/** @type {WsEvent[]} */ ([]))
  const [sessionId,  setSessionId]  = useState(/** @type {string|null} */ (null))

  // ── close helper ────────────────────────────────────────────────────────────

  const closeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.onclose = null // prevent our onclose from firing again
      socketRef.current.close()
      socketRef.current = null
    }
    setIsRunning(false)
  }, [])

  // ── cleanup on unmount ───────────────────────────────────────────────────────

  useEffect(() => closeSocket, [closeSocket])

  // ── startRun ─────────────────────────────────────────────────────────────────

  /**
   * Open the WebSocket and begin execution.
   *
   * @param {{ provider?: string, model?: string|null, headless?: boolean }} config
   */
  const startRun = useCallback((config = {}) => {
    if (socketRef.current) return // already running

    // Reset state for the new run
    setEvents([])
    setSessionId(null)
    setIsRunning(true)

    const socket = new WebSocket(wsUrl(testCaseId))
    socketRef.current = socket

    // ── onopen: send config within the backend's 1 s window ─────────────────
    socket.onopen = () => {
      const payload = {
        provider: config.provider ?? 'google',
        model:    config.model    ?? null,
        headless: config.headless ?? true,
      }
      socket.send(JSON.stringify(payload))
    }

    // ── onmessage: accumulate events, capture session_id ────────────────────
    socket.onmessage = (msgEvent) => {
      let frame
      try {
        frame = JSON.parse(msgEvent.data)
      } catch {
        // Non-JSON frame — shouldn't happen, but guard anyway
        console.warn('[ws] non-JSON frame:', msgEvent.data)
        return
      }

      setEvents((prev) => [...prev, frame])

      // Capture the run ID as soon as the server emits execution.started
      if (frame.type === 'execution.started' && frame.session_id) {
        setSessionId(frame.session_id)
      }

      // Terminal frames — close and notify parent
      if (frame.type === 'done' || frame.type === 'error') {
        const sid = frame.session_id ?? frame.type // fallback key
        closeSocket()
        onFinishedRef.current?.(sid)
      }
    }

    // ── onerror: surface to event feed ──────────────────────────────────────
    socket.onerror = () => {
      setEvents((prev) => [
        ...prev,
        {
          type:    'error',
          message: 'WebSocket connection error. Is the server running?',
          event_id: 'ws-err',
          timestamp: new Date().toISOString(),
        },
      ])
    }

    // ── onclose: clean up ────────────────────────────────────────────────────
    socket.onclose = (ev) => {
      socketRef.current = null
      setIsRunning(false)

      // Abnormal closure — inject a synthetic error frame for the feed
      if (ev.code !== 1000 && ev.code !== 1005) {
        const reason =
          ev.code === 4009 ? 'Test case is already running.' :
          ev.code === 4004 ? 'Test case not found.' :
          `Connection closed (code ${ev.code})${ev.reason ? ': ' + ev.reason : ''}.`

        setEvents((prev) => [
          ...prev,
          {
            type:    'error',
            message: reason,
            event_id: 'ws-close',
            timestamp: new Date().toISOString(),
          },
        ])
      }
    }
  }, [testCaseId, closeSocket])

  // ── stopWatching ─────────────────────────────────────────────────────────────
  //
  // Closes the socket locally, which triggers the backend disconnect handler
  // to abort the active test execution on the server.

  const stopWatching = useCallback(() => {
    closeSocket()
  }, [closeSocket])

  return { isRunning, events, sessionId, startRun, stopWatching }
}

