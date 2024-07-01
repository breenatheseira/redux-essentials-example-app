import React, { useEffect } from 'react'
import { Spinner } from '../../components/Spinner'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { 
  fetchPosts,
  selectPostIds,
  selectPostById,
} from './postsSlice'

let PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))

  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

PostExcerpt = React.memo(PostExcerpt)

export const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds = useSelector(selectPostIds)

  const postsStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if(postsStatus === 'idle'){
      dispatch(fetchPosts())
    }
  }, [])

  let content

  switch (postsStatus) {
    case 'loading':
      content = <Spinner text='Loading...' />
      break
    case 'succeeded':
      // Sort posts in reverse order
      content = orderedPostIds.map(postId => (
        <PostExcerpt key={postId} postId={postId} />
      ))
      break
    case 'failed':
      content = <div>{error}</div>
      break
    default:
      break;
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}