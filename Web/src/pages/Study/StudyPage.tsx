import {Link} from "react-router-dom";
import "../../styles/App.css";
import {useEffect, useState} from "react";

interface Category {
    title: string;
    description: string;
}

export default function StudyPage() {

    const [categories, setCategories]= useState<Category[]>([]);

    useEffect(()=>{

        const fetchCategory = async () => {

            // response 받기
            const response = await fetch(`markdowns/study/index.json`);
            if (!response.ok) throw new Error("Failed to load posts");

            const data: Category[] = await response.json();

            setCategories(data);
        };

        if(categories) fetchCategory();

    }, [categories]);

    return (
        <>
            <h1> Study </h1>
            <br/><br/><br/>

            <ul>
                {categories.map((category) => (
                    <p key={category.title}>
                        <Link to={`/study/${category.title}`} className="link">{category.title.toUpperCase()}</Link>
                        <p className="description">{category.description}</p>
                        <br/>
                    </p>
                ))}
            </ul>
        </>
    );
}