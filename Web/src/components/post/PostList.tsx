import {Link, useParams} from "react-router-dom";

export default function PostList() {

    const {category} = useParams();

    const posts = [
        { id : "post1", title: "첫글"},
        { id : "post1", title: "첫글"}
    ]
    return (
        <>
            <h2>{category?.toUpperCase()} Posts</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link to={`/Web/src/pages/Study/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}