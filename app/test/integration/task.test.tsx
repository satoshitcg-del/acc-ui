import { expect, test, describe, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import TaskManagement from "../../routes/task-management/index";

// Mock the services
vi.mock("../../services/TaskManagementService", () => ({
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

describe("Task Management Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("complete task management workflow", async () => {
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

    const TaskManagementService = require("../../services/TaskManagementService").default;
    const mockGetTaskLists = vi.fn().mockResolvedValue({
      tasks: mockTasks,
      total: 2
    });
    const mockCreateTask = vi.fn().mockResolvedValue({ 
      id: 3, 
      cr_no: "CR-003", 
      success: true 
    });
    const mockUpdateTask = vi.fn().mockResolvedValue({ 
      id: 1, 
      status: "in_progress", 
      success: true 
    });
    const mockDeleteTask = vi.fn().mockResolvedValue({ success: true });

    TaskManagementService().getTaskLists = mockGetTaskLists;
    TaskManagementService().createTask = mockCreateTask;
    TaskManagementService().updateTaskById = mockUpdateTask;
    TaskManagementService().deleteTaskById = mockDeleteTask;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(mockGetTaskLists).toHaveBeenCalled();
    });

    // Test search functionality
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "login issue" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("login issue");
    });

    // Test priority filtering
    const priorityFilter = screen.getByRole("combobox", { name: /priority/i });
    fireEvent.change(priorityFilter, { target: { value: "high" } });

    await waitFor(() => {
      expect(priorityFilter).toHaveValue("high");
    });

    // Test status filtering
    const statusFilter = screen.getByRole("combobox", { name: /status/i });
    fireEvent.change(statusFilter, { target: { value: "open" } });

    await waitFor(() => {
      expect(statusFilter).toHaveValue("open");
    });

    // Test assignee filtering
    const assigneeFilter = screen.getByRole("combobox", { name: /assignee/i });
    fireEvent.change(assigneeFilter, { target: { value: "John Doe" } });

    await waitFor(() => {
      expect(assigneeFilter).toHaveValue("John Doe");
    });

    // Test task creation
    const createButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalled();
    });

    // Test task update
    const updateButton = screen.getByRole("button", { name: /update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalled();
    });

    // Test task deletion
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalled();
    });
  });

  test("handles task creation with validation", async () => {
    const TaskManagementService = require("../../services/TaskManagementService").default;
    const mockCreateTask = vi.fn().mockResolvedValue({ 
      id: 3, 
      cr_no: "CR-003", 
      success: true 
    });
    TaskManagementService().createTask = mockCreateTask;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Simulate create task with valid data
    const createButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalled();
    });
  });

  test("handles task assignment workflow", async () => {
    const TaskManagementService = require("../../services/TaskManagementService").default;
    const mockUpdateTask = vi.fn().mockResolvedValue({ 
      id: 1, 
      assignee: [{ id: 2, full_name: "Jane Smith" }], 
      success: true 
    });
    TaskManagementService().updateTaskById = mockUpdateTask;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Simulate task assignment
    const assignButton = screen.getByRole("button", { name: /assign/i });
    fireEvent.click(assignButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalled();
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

  test("handles error scenarios", async () => {
    const TaskManagementService = require("../../services/TaskManagementService").default;
    const mockGetTaskLists = vi.fn().mockRejectedValue(new Error("Network error"));
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

  test("handles empty task list", async () => {
    const TaskManagementService = require("../../services/TaskManagementService").default;
    const mockGetTaskLists = vi.fn().mockResolvedValue({
      tasks: [],
      total: 0
    });
    TaskManagementService().getTaskLists = mockGetTaskLists;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });
  });

  test("handles task status transitions", async () => {
    const TaskManagementService = require("../../services/TaskManagementService").default;
    const mockUpdateTask = vi.fn().mockResolvedValue({ 
      id: 1, 
      status: "closed", 
      success: true 
    });
    TaskManagementService().updateTaskById = mockUpdateTask;

    render(
      <BrowserRouter>
        <TaskManagement />
      </BrowserRouter>
    );

    // Simulate status change
    const statusButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalled();
    });
  });
});