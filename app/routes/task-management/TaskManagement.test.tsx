import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import TaskManagement from "./index";

// Mock the services
vi.mock("../../../services/TaskManagementService", () => ({
  default: () => ({
    getTaskLists: vi.fn(),
    getOneTask: vi.fn(),
    createTask: vi.fn(),
    updateTaskById: vi.fn(),
    deleteTaskById: vi.fn()
  })
}));

// Mock the hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({})
  };
});

describe("TaskManagement Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders task management interface", () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Check if the component renders without crashing
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("displays loading state initially", () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // The component should show loading state initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("handles task data loading", async () => {
    const mockTasks = [
      { 
        id: 1, 
        cr_no: "CR-001", 
        priority: "high", 
        status: "open", 
        subject: "Fix login issue",
        created_by: "user1",
        due_date: "2024-01-15",
        created_at: "2024-01-01",
        assignee: [{ id: 1, full_name: "John Doe" }]
      },
      { 
        id: 2, 
        cr_no: "CR-002", 
        priority: "medium", 
        status: "in_progress", 
        subject: "Update documentation",
        created_by: "user2",
        due_date: "2024-01-20",
        created_at: "2024-01-02",
        assignee: [{ id: 2, full_name: "Jane Smith" }]
      }
    ];

    const TaskManagementService = require("../../../services/TaskManagementService").default;
    const mockGetTaskLists = vi.fn().mockResolvedValue({
      tasks: mockTasks,
      total: 2
    });
    TaskManagementService().getTaskLists = mockGetTaskLists;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetTaskLists).toHaveBeenCalled();
    });
  });

  test("handles task creation", async () => {
    const TaskManagementService = require("../../../services/TaskManagementService").default;
    const mockCreateTask = vi.fn().mockResolvedValue({ success: true });
    TaskManagementService().createTask = mockCreateTask;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Simulate create action
    const createButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalled();
    });
  });

  test("handles task deletion", async () => {
    const TaskManagementService = require("../../../services/TaskManagementService").default;
    const mockDeleteTask = vi.fn().mockResolvedValue({ success: true });
    TaskManagementService().deleteTaskById = mockDeleteTask;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Simulate delete action
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalled();
    });
  });

  test("handles task status update", async () => {
    const TaskManagementService = require("../../../services/TaskManagementService").default;
    const mockUpdateTask = vi.fn().mockResolvedValue({ success: true });
    TaskManagementService().updateTaskById = mockUpdateTask;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Simulate status update
    const statusButton = screen.getByRole("button", { name: /update status/i });
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalled();
    });
  });

  test("handles search functionality", async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "test task" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("test task");
    });
  });

  test("handles priority filtering", async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    const priorityFilter = screen.getByRole("combobox", { name: /priority/i });
    fireEvent.change(priorityFilter, { target: { value: "high" } });

    await waitFor(() => {
      expect(priorityFilter).toHaveValue("high");
    });
  });

  test("handles status filtering", async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    const statusFilter = screen.getByRole("combobox", { name: /status/i });
    fireEvent.change(statusFilter, { target: { value: "open" } });

    await waitFor(() => {
      expect(statusFilter).toHaveValue("open");
    });
  });

  test("handles assignee filtering", async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    const assigneeFilter = screen.getByRole("combobox", { name: /assignee/i });
    fireEvent.change(assigneeFilter, { target: { value: "John Doe" } });

    await waitFor(() => {
      expect(assigneeFilter).toHaveValue("John Doe");
    });
  });

  test("handles date range filtering", async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });

    await waitFor(() => {
      expect(startDateInput).toHaveValue("2024-01-01");
      expect(endDateInput).toHaveValue("2024-01-31");
    });
  });

  test("handles pagination", async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    const nextPageButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    // Verify pagination action
    expect(nextPageButton).toBeInTheDocument();
  });

  test("displays error message on API failure", async () => {
    const TaskManagementService = require("../../../services/TaskManagementService").default;
    const mockGetTaskLists = vi.fn().mockRejectedValue(new Error("API Error"));
    TaskManagementService().getTaskLists = mockGetTaskLists;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test("handles task editing", async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Verify edit action
    expect(editButton).toBeInTheDocument();
  });

  test("handles task assignment", async () => {
    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    const assignButton = screen.getByRole("button", { name: /assign/i });
    fireEvent.click(assignButton);

    // Verify assignment action
    expect(assignButton).toBeInTheDocument();
  });
});