import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newBlog, setNewBlog] = useState('')
    const [blogAuthor, setBlogAuthor] = useState('')
    const [blogUrl, setBlogUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newBlog,
            author: blogAuthor,
            url: blogUrl,
        })
    
        setNewBlog('')
        setBlogAuthor('')
        setBlogUrl('')
    }

    return (
        <div>
            <h2>create new</h2>

            <form onSubmit={addBlog}>
                <div>
                title: 
                <input
                    value={newBlog}
                    onChange={event => setNewBlog(event.target.value)}
                />
                </div>
                <div>
                author:
                <input
                    value={blogAuthor}
                    onChange={event => setBlogAuthor(event.target.value)}
                />
                </div>
                <div>
                url:
                <input
                    value={blogUrl}
                    onChange={event => setBlogUrl(event.target.value)}
                />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm