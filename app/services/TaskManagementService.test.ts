import { expect, test, describe, vi, beforeEach } from "vitest";
import axios from "axios";
import TaskManagementService from "./TaskManagementService";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

describe("TaskManagementService", () => {
  let taskService: ReturnType<typeof TaskManagementService>;

  beforeEach(() => {
    vi.clearAllMocks();
    taskService = TaskManagementService();
  });

  describe("getTaskLists", () => {
    test("should fetch task list successfully", async () => {
      const mockResponse = {
        data: {
          tasks: [
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
          ],
          total: 2
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await taskService.getTaskLists({ page: 1, limit: 10 });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/cr-ticket/list"),
        expect.objectContaining({
          params: { page: 1, limit: 10 }
        })
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle API error when fetching task list", async () => {
      const error = new Error("Failed to fetch tasks");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(taskService.getTaskLists({ page: 1, limit: 10 }))
        .rejects.toThrow("Failed to fetch tasks");
    });
  });

  describe("getOneTask", () => {
    test("should fetch single task successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          cr_no: "CR-001",
          priority: "high",
          status: "open",
          subject: "Fix login issue",
          description: "Users cannot login to the system",
          created_by: "user1",
          due_date: "2024-01-15",
          created_at: "2024-01-01",
          assignee: [{ id: 1, full_name: "John Doe" }]
        }
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await taskService.getOneTask("1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/v1/cr-ticket/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when fetching single task", async () => {
      const error = new Error("Task not found");
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(taskService.getOneTask("999"))
        .rejects.toThrow("Task not found");
    });
  });

  describe("createTask", () => {
    test("should create task successfully", async () => {
      const mockResponse = {
        data: {
          id: 3,
          cr_no: "CR-003",
          success: true
        }
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const taskData = {
        cr_no: "CR-003",
        priority: "high",
        status: "open",
        subject: "New task",
        created_by: "user1",
        due_date: "2024-01-20",
        assignee: [{ id: 1, full_name: "John Doe" }]
      };
      const result = await taskService.createTask(taskData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/v1/cr-ticket"),
        taskData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle validation error when creating task", async () => {
      const error = new Error("Subject is required");
      mockedAxios.post.mockRejectedValueOnce(error);

      const taskData = {
        cr_no: "CR-003",
        priority: "high",
        status: "open",
        subject: "",
        created_by: "user1"
      };

      await expect(taskService.createTask(taskData))
        .rejects.toThrow("Subject is required");
    });
  });

  describe("updateTaskById", () => {
    test("should update task successfully", async () => {
      const mockResponse = {
        data: {
          id: 1,
          status: "in_progress",
          success: true
        }
      };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const updateData = {
        status: "in_progress",
        assignee: [{ id: 2, full_name: "Jane Smith" }]
      };
      const result = await taskService.updateTaskById("1", updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/v1/cr-ticket/1"),
        updateData,
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when updating task", async () => {
      const error = new Error("Task not found");
      mockedAxios.patch.mockRejectedValueOnce(error);

      const updateData = { status: "closed" };

      await expect(taskService.updateTaskById("999", updateData))
        .rejects.toThrow("Task not found");
    });
  });

  describe("deleteTaskById", () => {
    test("should delete task successfully", async () => {
      const mockResponse = { data: { success: true } };
      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await taskService.deleteTaskById("1");

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/v1/cr-ticket/1"),
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse.data);
    });

    test("should handle error when deleting task", async () => {
      const error = new Error("Cannot delete task with active dependencies");
      mockedAxios.delete.mockRejectedValueOnce(error);

      await expect(taskService.deleteTaskById("1"))
        .rejects.toThrow("Cannot delete task with active dependencies");
    });
  });
});