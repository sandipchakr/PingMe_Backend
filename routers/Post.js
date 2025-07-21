import { Router } from "express";
import Posts from "../models/posts.js";
import { requireAuth } from "../middleware/auth.js";
import Comment from "../models/comments.js";
import Like from "../models/likes.js"; // import it

const router = Router();

router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find().populate("createdBy", "fullname profileImageURL");
        const comments = await Comment.find().populate("createdBy", "fullname profileImageURL");
        const likes = await Like.find();
        res.json({ posts, comments, likes });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts", error: error.message });
    }
});

router.get("/myPosts", requireAuth, async (req, res) => {
    try {
        const myPosts = await Posts.find({ createdBy: req.user._id }).populate("createdBy", "fullname profileImageURL");
        const comments = await Comment.find().populate("createdBy", "fullname profileImageURL");
        const likes = await Like.find();
        return res.json({myPosts,comments,likes});
    } catch (err) {
        res.status(500).json({ message: "Error fetching your posts", error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id).populate("createdBy", "fullname profileImageURL");
        const comments = await Comment.find({ postId: req.params.id }).populate("createdBy", "fullname profileImageURL");
        const likes = await Like.find();

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json({ post, comments, likes });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch post", error: error.message });
    }
});

router.post("/comment/:postid", requireAuth, async (req, res) => {
    try {
        const comment = await Comment.create({
            content: req.body.content,
            postId: req.params.postid,
            createdBy: req.user._id,
        });

        const populatedComment = await comment.populate("createdBy", "fullname profileImageURL");

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ error: "Something went wrong" });
    }

});
router.post("/like/:postid", requireAuth, async (req, res) => {
    try {
        const existingLike = await Like.findOne({
            postId: req.params.postid,
            userId: req.user._id,
        });

        if (existingLike) {
            // 👎 Unlike (remove)
            await Like.deleteOne({ _id: existingLike._id });
            const likes = await Like.find();
            return res.json({ liked: false, likes });
        } else {
            // 👍 Like (create)
            await Like.create({
                postId: req.params.postid,
                userId: req.user._id,
            });

            const likes = await Like.find();
            return res.json({ likes });
        }
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});




router.post("/", requireAuth, async (req, res) => {
    const { title, content, coverImgUrl } = req.body
    const posts = await Posts.create({
        title,
        content,
        coverImgUrl,
        createdBy: req.user._id
    });
    res.json({ message: "Your post successfully uploaded.." });
});

router.put("/:id", requireAuth, async (req, res) => {
    const postId = req.params.id;
    const { title, content, coverImgUrl } = req.body;

    try {
        // find post
        const post = await Posts.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // check ownership
        if (post.createdBy.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized to update this post" });
        }

        // update fields
        post.title = title || post.title;
        post.content = content || post.content;
        post.coverImgUrl = coverImgUrl || post.coverImgUrl;

        await post.save();

        res.json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.delete("/delete/:id", requireAuth, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        if (!req.user) {
            return res.status(401).json({ message: "You must be logged in." });
        }

        if (post.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this blog." });
        }

        await Posts.deleteOne({ _id: req.params.id });

        res.json({ message: "Post deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

export default router;