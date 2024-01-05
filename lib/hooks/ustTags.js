// useTags.js
import { useState, useEffect } from "react";

export default function useTags(session) {
    const [tags, setTags] = useState([]);
    const supabase = createClientComponentClient();

    const fetchTags = async () => {
        const { data, error } = await supabase
            .from("tags")
            .select("*")
            .eq("user_id", session.user.id);
        setTags(data);
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return [tags, fetchTags];
}