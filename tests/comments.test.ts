import { Request, Response } from "express";
import {
  postCreateComment,
} from "../src/controllers/comments";

// Create a mock user object
const mockUser = {
  id: 1,
  fullName: "John Doe",
  createComment: jest.fn(),
};

describe("commentCreateComment", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: { content: "Test comment" },
      query: { postId: 1},
    } as unknown as Request;
    res = {
      locals: { user: mockUser },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a comment and return the comment details", async () => {
    mockUser.createComment.mockResolvedValueOnce({ id: 1 });

    await postCreateComment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      status_message: "comment created",
      results: {
        commentId: 1,
        userId: 1,
        postId: 1,
      },
    });
    expect(mockUser.createComment).toHaveBeenCalledWith({ content: "Test comment", postId: 1 });
  });

  test("should handle bad request if comment content is missing", async () => {
    req.body.content = "";

    await postCreateComment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "bad request",
    });
    expect(mockUser.createComment).not.toHaveBeenCalled();
  });

  test("should handle internal server error", async () => {
    mockUser.createComment.mockRejectedValueOnce(new Error("Database error"));

    await postCreateComment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "internal server error",
    });
    expect(mockUser.createComment).toHaveBeenCalledWith({ content: "Test comment", postId: 1 });
  });
});