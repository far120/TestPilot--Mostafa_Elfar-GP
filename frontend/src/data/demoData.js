// Demo Data & Offline Simulation Presets for Mostafa Elfar's Graduation Showcase

export const DEMO_DEVELOPER_INFO = {
  name: "Mostafa Elfar",
  title: "Junior MERN Stack Developer",
  degree: "B.Sc. Computer Science / Software Engineering (Graduation 2026)",
  project: "TestPilot — Autonomous LLM Browser Testing Platform",
  summary: "MERN stack developer with experience in building web applications.",
  email: "mostafa.m.elfar@gmail.com",
  github: "https://github.com/far120",
  linkedin: "https://www.linkedin.com/in/mostafa-mahmoud-el-far-6a67732b5",
  location: "Egypt",
  skills: [
    "React 18 & Vite",
    "Tailwind CSS & Glassmorphism",
  ]
};

export const DEMO_PROJECTS = [
  {
    id: "demo-proj-1",
    name: "E-Commerce Checkout Suite",
    description: "End-to-end user authentication, product search, cart operations, and payment verification flow.",
    test_cases_count: 3,
    created_at: "2026-08-20T10:00:00Z",
    updated_at: "2026-08-25T14:30:00Z"
  },
  {
    id: "demo-proj-2",
    name: "SaaS Admin Dashboard Tests",
    description: "Automated regression testing for data tables, metric cards, role permissions, and export modals.",
    test_cases_count: 2,
    created_at: "2026-08-22T09:15:00Z",
    updated_at: "2026-08-26T11:00:00Z"
  },
  {
    id: "demo-proj-3",
    name: "AI Form Validation & Edge Cases",
    description: "Negative testing, invalid input assertions, field recovery, and boundary value testing.",
    test_cases_count: 4,
    created_at: "2026-08-24T16:20:00Z",
    updated_at: "2026-08-26T12:45:00Z"
  }
];

export const DEMO_TEST_SUITES = [
  {
    id: "demo-tc-1",
    project_id: "demo-proj-1",
    name: "SauceDemo Login & Add To Cart",
    type: "P",
    target_url: "https://www.saucedemo.com",
    steps: [
      { action: "Enter username 'standard_user' and password 'secret_sauce'", assertion: "Redirected to inventory page" },
      { action: "Click 'Add to cart' on Sauce Labs Backpack", assertion: "Cart badge displays '1'" },
      { action: "Open cart and click 'Checkout'", assertion: "Checkout step one form appears" },
      { action: "Fill first name 'Mostafa', last name 'Elfar', zip '12345' and continue", assertion: "Overview page shows total price" }
    ]
  },
  {
    id: "demo-tc-2",
    project_id: "demo-proj-2",
    name: "Google AI Search & Title Verification",
    type: "P",
    target_url: "https://www.google.com",
    steps: [
      { action: "Type 'TestPilot AI Browser Automation' into search bar", assertion: "Search predictions drop-down appears" },
      { action: "Press Enter to execute search", assertion: "Search results header displays relevant links" }
    ]
  },
  {
    id: "demo-tc-3",
    project_id: "demo-proj-3",
    name: "User Registration Input Validation",
    type: "N",
    target_url: "https://example.com/register",
    steps: [
      { action: "Submit empty registration form", assertion: "Validation message 'Email is required' is visible" },
      { action: "Type invalid email 'invalid-email' and submit", assertion: "Error banner 'Enter valid email' appears" }
    ]
  }
];

export const DEMO_EXECUTION_EVENTS = [
  {
    type: "execution.started",
    timestamp: "15:45:01",
    message: "Test execution initiated. Headless Chromium browser launched via Playwright.",
    step_index: 0
  },
  {
    type: "step.started",
    timestamp: "15:45:02",
    message: "Step 1: Navigating to target URL https://www.saucedemo.com",
    step_index: 1
  },
  {
    type: "agent.observation",
    timestamp: "15:45:03",
    message: "Page snapshot captured (1920x1080). Identified username field (#user-name) and password field (#password).",
    step_index: 1,
    screenshot_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
  },
  {
    type: "agent.tool.called",
    timestamp: "15:45:04",
    message: "LLM selected tool `fill_input` with args: { selector: '#user-name', value: 'standard_user' }",
    step_index: 1
  },
  {
    type: "agent.tool.result",
    timestamp: "15:45:05",
    message: "Tool `fill_input` executed successfully in 120ms.",
    step_index: 1
  },
  {
    type: "agent.tool.called",
    timestamp: "15:45:06",
    message: "LLM selected tool `click_element` with args: { selector: '#login-button' }",
    step_index: 1
  },
  {
    type: "verification",
    timestamp: "15:45:07",
    status: "passed",
    message: "Assertion PASSED: Target URL contains '/inventory.html' and header '.app_logo' is present.",
    step_index: 1
  },
  {
    type: "step.completed",
    timestamp: "15:45:07",
    message: "Step 1 completed successfully in 5.2s.",
    step_index: 1
  },
  {
    type: "step.started",
    timestamp: "15:45:08",
    message: "Step 2: Click 'Add to cart' on Sauce Labs Backpack",
    step_index: 2
  },
  {
    type: "agent.observation",
    timestamp: "15:45:09",
    message: "Inventory grid loaded. Button [data-test='add-to-cart-sauce-labs-backpack'] located.",
    step_index: 2,
    screenshot_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
  },
  {
    type: "verification",
    timestamp: "15:45:10",
    status: "passed",
    message: "Assertion PASSED: Cart badge counter updated to '1'.",
    step_index: 2
  },
  {
    type: "step.completed",
    timestamp: "15:45:10",
    message: "Step 2 completed successfully in 2.1s.",
    step_index: 2
  },
  {
    type: "execution.completed",
    timestamp: "15:45:11",
    message: "All test case steps passed! Total execution time: 10.3s. 0 errors, 2 visual snapshots verified.",
    step_index: 2
  }
];
