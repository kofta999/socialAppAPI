import { Request, Response } from "express";
import {
  postCreatePost,
  getPosts,
  putEditPost,
  deletePost,
} from "../src/controllers/posts";
import Post from "../src/models/post";

// Create a mock user object
const mockUser = {
  id: 1,
  fullName: "John Doe",
  createPost: jest.fn(),
};

describe("postCreatePost", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: { content: "Test post" },
    } as Request;
    res = {
      locals: { user: mockUser },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a post and return the post details", async () => {
    mockUser.createPost.mockResolvedValueOnce({ id: 1 });

    await postCreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      status_message: "created post",
      results: {
        postId: 1,
        userId: 1,
        userFullName: "John Doe",
      },
    });
    expect(mockUser.createPost).toHaveBeenCalledWith({ content: "Test post" });
  });

  test("should handle bad request if post content is missing", async () => {
    req.body.content = "";

    await postCreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "bad request",
    });
    expect(mockUser.createPost).not.toHaveBeenCalled();
  });

  test("should handle internal server error", async () => {
    mockUser.createPost.mockRejectedValueOnce(new Error("Database error"));

    await postCreatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "internal server error",
    });
    expect(mockUser.createPost).toHaveBeenCalledWith({ content: "Test post" });
  });
});

describe("getPosts", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {
      locals: { user: mockUser },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch all posts and return them in the response", async () => {
    const mockPosts = [
      { id: 1, content: "Post 1" },
      { id: 2, content: "Post 2" },
    ] as Post[];

    // Mock the findAll method of the Post model
    Post.scope = jest.fn().mockReturnValueOnce(Post);
    Post.findAll = jest.fn().mockResolvedValueOnce(mockPosts);

    await getPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      status_message: "fetched all posts",
      results: {
        posts: mockPosts,
      },
    });
    expect(Post.scope).toHaveBeenCalledWith({
      method: ["withLikesAndComments", 1],
    });
    expect(Post.findAll).toHaveBeenCalledTimes(1);
  });

  test("should handle internal server error", async () => {
    // Mock the findAll method of the Post model to throw an error
    Post.scope = jest.fn().mockReturnValueOnce(Post);
    Post.findAll = jest.fn().mockRejectedValueOnce(new Error("Database error"));

    await getPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "internal server error",
    });
    expect(Post.scope).toHaveBeenCalledWith({
      method: ["withLikesAndComments", 1],
    });
    expect(Post.findAll).toHaveBeenCalledTimes(1);
  });
});

describe("putEditPost", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: { content: "Updated content" },
      query: { postId: "1" },
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

  test("should update post content and return success response", async () => {
    const mockPost = {
      id: 1,
      userId: 1,
      content: "Original content",
      save: jest.fn(),
    } as unknown as Post;

    // Mock the findByPk method of the Post model
    Post.findByPk = jest.fn().mockResolvedValueOnce(mockPost);

    await putEditPost(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      status_message: "updated post",
      results: {
        userId: 1,
        postId: 1,
      },
    });
    expect(mockPost.content).toBe("Updated content");
    expect(mockPost.save).toHaveBeenCalledTimes(1);
  });

  test("should handle post not found", async () => {
    // Mock the findByPk method of the Post model to return null
    Post.findByPk = jest.fn().mockResolvedValueOnce(null);

    await putEditPost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "the requested resource is not found",
    });
  });

  test("should handle access forbidden", async () => {
    const mockPost = {
      id: 1,
      userId: 2,
    } as unknown as Post;

    // Mock the findByPk method of the Post model
    Post.findByPk = jest.fn().mockResolvedValueOnce(mockPost);

    await putEditPost(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "access forbidden",
    });
  });

  test("should handle bad request with no post content", async () => {
    req.body.content = "";

    await putEditPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "bad request",
    });
  });

  test("should handle internal server error", async () => {
    // Mock the findByPk method of the Post model to throw an error
    Post.findByPk = jest
      .fn()
      .mockRejectedValueOnce(new Error("Database error"));

    await putEditPost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "internal server error",
    });
  });
});

describe("deletePost", () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      query: { postId: "1" },
    } as unknown as Request;
    res = {
      locals: { user: { id: 1 } },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should delete the post and return status 204", async () => {
    const mockPost = {
      id: 1,
      userId: 1,
      destroy: jest.fn(),
    } as unknown as Post;

    // Mock the findByPk method of the Post model
    Post.findByPk = jest.fn().mockResolvedValueOnce(mockPost);

    await deletePost(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
    expect(mockPost.destroy).toHaveBeenCalledTimes(1);
  });

  test("should handle post not found", async () => {
    // Mock the findByPk method of the Post model to return null
    Post.findByPk = jest.fn().mockResolvedValueOnce(null);

    await deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "the requested resource is not found",
    });
  });

  test("should handle access forbidden", async () => {
    const mockPost = {
      id: 1,
      userId: 2,
    } as unknown as Post;

    // Mock the findByPk method of the Post model
    Post.findByPk = jest.fn().mockResolvedValueOnce(mockPost);

    await deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "access forbidden",
    });
  });

  test("should handle internal server error", async () => {
    // Mock the findByPk method of the Post model to throw an error
    Post.findByPk = jest
      .fn()
      .mockRejectedValueOnce(new Error("Database error"));

    await deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      status_message: "internal server error",
    });
  });
});
