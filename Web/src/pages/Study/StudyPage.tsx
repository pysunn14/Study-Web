import {Link} from "react-router-dom";
import "../../styles/App.css";
import {useEffect, useState} from "react";

interface Category {
    title: string;
    description: string;
    count: number;
}

export default function StudyPage() {

    const [categories, setCategories]= useState<Category[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
            // response 받기
            const response = await fetch(`markdowns/study/index.json`);
            if (!response.ok) throw new Error("Failed to load categories");
            const data: Category[] = await response.json();

            // 각 category 의 글 수를 조회하기
            const getPostingCount = await Promise.all(
                data.map(async (category) => {
                    const posts = await fetch(`markdowns/study/${category.title}/index.json`);

                    if (!posts.ok) {
                        console.warn(`File not found: markdowns/study/${category.title}/index.json`);
                        category.count = 0;
                        return category;
                    }

                    const postList = await posts.json();
                    console.log(postList);
                    category.count = postList.length;
                    return category;
                })
            );

            setCategories(getPostingCount);
        };

        fetchCategory();

        console.log(categories);
    }, []);


    return (
        <>
            <h1> Study </h1>
            <br/><br/><br/>

            <ul>
                {categories.map((category) => (
                    <li key={category.title}>
                        <Link to={`/study/${category.title}`} className="link">{category.title.toUpperCase()} ({category.count})</Link>
                        <p className="description">{category.description}</p>
                        <br/>
                    </li>
                ))}
            </ul>
        </>
    );
}