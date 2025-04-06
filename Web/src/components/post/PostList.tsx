import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "../../styles/Markdowns.css"
import "../../styles/App.css"

export default function PostList() {

    const {category} = useParams();
    const [posts, setPosts] = useState<{ id : string, title : string }[]>([]);

    useEffect(()=>{

        const fetchPost = async () => {

            // response 받기
            const response = await fetch(`markdowns/study/${category}/index.json`);
            if (!response.ok) throw new Error("Failed to load posts");

            const files: string[] = await response.json();

            const postList = files.map((file)=>({
                id : file.replace(".md", ""),
                title : file.replace(".md", ""),
            }));

            setPosts(postList);

            console.log(postList);
        };

        if(category) fetchPost();

    }, [category]);

    return (
        <>
            <h2>{category?.toUpperCase()} Posts</h2>
            <div className="markdown-link">
                {posts.map((post) => (
                    <div key={post.id}>
                        <Link to={`/study/${category}/${post.id}`} className="post">{post.title}</Link>
                    </div>
                ))}
            </div>
        </>
    );
}