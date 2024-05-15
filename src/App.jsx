import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Footer from './components/Footer'
import blogService from './services/blogs'
import Blog from './components/Blog'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [showAll, setShowAll] = useState(true)

  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })

    if (!blogObject.title || !blogObject.url) {
      setErrorMessage('The blog is missing necessary information')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    setErrorMessage(`A new blog '${blogObject.title}' successfully added`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setErrorMessage('login successful')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    setErrorMessage('logout successful')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">logout</button>
    </form>
  )

  const blogsToShow = showAll

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const updateBlogLikes = (updatedBlog) => {
    setBlogs(blogs.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog)))
  }

  const deleteBlog = id => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  function compareLikes(a, b) {
    return b.likes - a.likes
  }

  return (
    <div>
      <Notification message={errorMessage} />
      {!user && <h2>log in to application</h2>}
      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p>
        {logoutForm()}
        <Togglable buttonLabel="create">
          <BlogForm
            createBlog={addBlog} user={user.name}
          />
        </Togglable>
        {blogs.sort(compareLikes).map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlogLikes={updateBlogLikes}
            deleteBlog={deleteBlog}
            currentUser={user}
          />
        ))}
      </div>
      }
    </div>
  )
}

export default App