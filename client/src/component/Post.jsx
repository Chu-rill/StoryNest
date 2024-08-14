import React from "react";
import { Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
export default function Post({ post }) {
  return (
    <main>
      <div className="post">
        <div className="image">
          <Link to={`/post/${post._id}`}>
            <img src={`http://localhost:3001/${post.image}`} alt="" />
          </Link>
        </div>

        <div className="texts">
          <Link to={`/post/${post._id}`}>
            <h2>{post.title}</h2>
          </Link>
          <p className="info">
            <a href="" className="author">
              {post.author.username}
            </a>
            <time>{formatISO9075(new Date(post.createdAt))}</time>
          </p>

          <p>{post.summary}</p>
        </div>
      </div>
    </main>
  );
}
