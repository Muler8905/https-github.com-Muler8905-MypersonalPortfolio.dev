import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Plus, Search, Tag, X, Trash2, Edit2, Save } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogPageProps {
  onBack: () => void;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Full Stack in 2025',
    excerpt: 'Exploring how AI and Serverless architectures are redefining the role of a Full Stack Developer.',
    content: `The landscape of full-stack development is rapidly evolving. By 2025, the definition of a "Full Stack Developer" will likely shift from someone who builds the entire stack to someone who orchestrates it.

Serverless architecture and Edge Computing are moving from niche to norm. Tools like Vercel and Cloudflare Workers allow us to run compute at the edge, reducing latency and removing the need for traditional server management. Database management is following suit with serverless SQL databases like Neon and PlanetScale.

Furthermore, AI-driven coding assistants are becoming integral. They handle boilerplate code, unit tests, and even complex refactoring. This doesn't replace the developer but elevates them to an architect role, focusing on system design, security, and business logic rather than syntax. The future belongs to those who can integrate these disparate services into a cohesive, performant product.`,
    author: 'Muluken Ugamo',
    date: 'Oct 12, 2024',
    category: 'Tech Trends',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Mastering Tailwind CSS for Scalable UI',
    excerpt: 'Why utility-first CSS is winning and how to organize your components for long-term maintenance.',
    content: `Tailwind CSS has polarized the community, but its value proposition for scalability is undeniable. The utility-first approach solves one of the hardest problems in CSS: maintainability.

In large-scale applications, the traditional "semantic class" approach often leads to append-only stylesheets. Developers are afraid to delete classes because they don't know what might break. Tailwind removes this fear. Styles are local to the markup.

To master Tailwind for scale, you must embrace componentization. Don't use @apply prematurely. Instead, build small, reusable React components (Buttons, Cards, Inputs) that encapsulate the utility classes. Use tools like clsx and tailwind-merge to allow for clean overrides. This "Component-First" architecture, combined with a strict tailwind.config.js design system, is the secret to keeping your UI consistent as your team grows.`,
    author: 'Muluken Ugamo',
    date: 'Sep 28, 2024',
    category: 'Frontend',
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800&auto=format&fit=crop',
    readTime: '8 min read'
  },
  {
    id: '3',
    title: 'Building AI Agents with Gemini API',
    excerpt: 'A step-by-step guide to integrating Google Gemini into your React applications for smarter UX.',
    content: `Integrating AI into web applications is no longer just a cool feature; it's a user expectation. Google's Gemini API provides a powerful, multimodal entry point for developers.

In this guide, we look at building a "Smart Document Assistant". The architecture is straightforward: React on the frontend, a Node.js proxy for security, and the Google GenAI SDK.

Key to success is "System Instructions". By giving the model a persona and strict rules before the user even types a query, you control the output quality. For example, telling Gemini "You are a helpful coding tutor who only answers in JSON" drastically changes the utility of the response. We also explore "Streaming", which is crucial for UX. Instead of waiting 5 seconds for a full answer, streaming allows the user to see text appear in real-time, making the application feel instantaneous.`,
    author: 'Muluken Ugamo',
    date: 'Aug 15, 2024',
    category: 'AI Engineering',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    readTime: '10 min read'
  }
];

const BlogPage: React.FC<BlogPageProps> = ({ onBack }) => {
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Admin Form State
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Load posts from local storage or defaults
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      try {
        const parsedPosts = JSON.parse(storedPosts);
        // Robust check: ensure it's an array and has at least one valid post structure if not empty
        if (Array.isArray(parsedPosts)) {
           if (parsedPosts.length === 0) {
              setPosts([]); // It's valid to have 0 posts if user deleted all
           } else if (parsedPosts[0].title) {
              setPosts(parsedPosts);
           } else {
              // Schema mismatch, reset
              setPosts(DEFAULT_POSTS);
              localStorage.setItem('blogPosts', JSON.stringify(DEFAULT_POSTS));
           }
        } else {
           setPosts(DEFAULT_POSTS);
           localStorage.setItem('blogPosts', JSON.stringify(DEFAULT_POSTS));
        }
      } catch (e) {
        console.error("Error parsing blog posts", e);
        setPosts(DEFAULT_POSTS);
        localStorage.setItem('blogPosts', JSON.stringify(DEFAULT_POSTS));
      }
    } else {
      setPosts(DEFAULT_POSTS);
      localStorage.setItem('blogPosts', JSON.stringify(DEFAULT_POSTS));
    }
  }, []);

  const handleReadPost = (post: BlogPost) => {
    setSelectedPost(post);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    
    setPosts(prevPosts => {
        let updatedPosts: BlogPost[];
        if (isEditing && newPost.id) {
            // Update Existing Post
            updatedPosts = prevPosts.map(p => p.id === newPost.id ? { ...p, ...newPost } as BlogPost : p);
        } else {
            // Create New Post
            const post: BlogPost = {
              id: Date.now().toString(),
              title: newPost.title || 'Untitled',
              excerpt: newPost.excerpt || '',
              content: newPost.content || '',
              author: 'Muluken Ugamo',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              category: newPost.category || 'General',
              imageUrl: newPost.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
              readTime: '3 min read'
            };
            updatedPosts = [post, ...prevPosts];
        }
        
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
        return updatedPosts;
    });

    // Reset and go back to list
    setNewPost({ title: '', excerpt: '', content: '', category: '', imageUrl: '' });
    setIsEditing(false);
    setView('list');
  };

  const handleEditClick = (e: React.MouseEvent, post: BlogPost) => {
      e.stopPropagation();
      e.preventDefault(); // Safety check
      setNewPost(post);
      setIsEditing(true);
      setView('create');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
      // Critical: Stop event from bubbling to the article card click handler
      e.stopPropagation();
      e.preventDefault();
      
      if (window.confirm("Are you sure you want to delete this post?")) {
          setPosts(currentPosts => {
              // Use functional update to guarantee we are filtering the latest state
              const updatedPosts = currentPosts.filter(p => p.id !== id);
              
              // Sync to local storage immediately within the callback to ensure consistency
              localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
              
              return updatedPosts;
          });
          
          // If we deleted the currently viewed post, go back to list
          if (view === 'detail' && selectedPost?.id === id) {
              setView('list');
              setSelectedPost(null);
          }
      }
  };

  const handleCancelCreate = () => {
    setNewPost({ title: '', excerpt: '', content: '', category: '', imageUrl: '' });
    setIsEditing(false);
    setView('list');
  };

  // --- LIST VIEW ---
  if (view === 'list') {
    return (
      <section className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors mb-4"
              >
                <ArrowLeft size={16} /> Back to Home
              </button>
              <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Blog & Insights</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Tutorials, tech deep dives, and career advice.</p>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Admin Button */}
               <button 
                 onClick={() => {
                     setNewPost({ title: '', excerpt: '', content: '', category: '', imageUrl: '' });
                     setIsEditing(false);
                     setView('create');
                 }}
                 className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-violet-600 dark:hover:bg-gray-200 transition-all shadow-lg"
               >
                 <Plus size={18} /> New Post
               </button>
            </div>
          </div>

          {/* Search / Filter Bar */}
          <div className="relative mb-12">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
             </div>
             <input 
               type="text" 
               placeholder="Search articles..." 
               className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm"
             />
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article 
                key={post.id}
                onClick={() => handleReadPost(post)}
                className="group cursor-pointer bg-white dark:bg-[#131b2e] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-200 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 relative"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 z-0 relative"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wide z-10">
                    {post.category}
                  </div>

                  {/* Admin Actions Overlay on Card - Ensure high z-index and pointer events */}
                  <div 
                    className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[60]"
                    onClick={(e) => e.stopPropagation()} /* Double safety to prevent bubble */
                  >
                      <button 
                        type="button"
                        onClick={(e) => handleEditClick(e, post)}
                        className="p-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/20 transition-colors shadow-sm cursor-pointer"
                        title="Edit Post"
                      >
                          <Edit2 size={16} className="pointer-events-none" />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteClick(e, post.id)}
                        className="p-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-white/20 transition-colors shadow-sm cursor-pointer"
                        title="Delete Post"
                      >
                          <Trash2 size={16} className="pointer-events-none" />
                      </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-300">
                           <User size={14} />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</span>
                     </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- DETAIL VIEW ---
  if (view === 'detail' && selectedPost) {
    return (
      <section className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Blog
            </button>

            {/* Detail View Admin Actions */}
            <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => handleEditClick(e, selectedPost)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                    <Edit2 size={16} /> Edit
                </button>
                <button 
                  onClick={(e) => handleDeleteClick(e, selectedPost.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                    <Trash2 size={16} /> Delete
                </button>
            </div>
          </div>

          <div className="mb-8">
             <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 text-xs font-bold uppercase tracking-wide">
                  {selectedPost.category}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">•</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">{selectedPost.date}</span>
             </div>
             
             <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight mb-8">
               {selectedPost.title}
             </h1>

             <div className="flex items-center justify-between py-6 border-y border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {selectedPost.author.charAt(0)}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedPost.author}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Full Stack Developer</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                   <Clock size={16} /> {selectedPost.readTime}
                </div>
             </div>
          </div>

          <div className="rounded-2xl overflow-hidden mb-10 shadow-xl">
             <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-auto object-cover" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-loose whitespace-pre-line">
            {selectedPost.content || selectedPost.excerpt}
          </div>

          {/* Simulated Comments / Footer of article */}
          <div className="mt-16 pt-10 border-t border-gray-200 dark:border-white/10">
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tags</h3>
             <div className="flex flex-wrap gap-2">
               {['Development', 'Engineering', 'React', 'Career'].map(tag => (
                 <span key={tag} className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-[#131b2e] rounded-lg text-gray-600 dark:text-gray-400 text-sm font-medium">
                    <Tag size={14} /> {tag}
                 </span>
               ))}
             </div>
          </div>
        </article>
      </section>
    );
  }

  // --- CREATE / EDIT VIEW (ADMIN) ---
  if (view === 'create') {
    return (
      <section className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={handleCancelCreate}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
            >
              <ArrowLeft size={16} /> Cancel
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Post' : 'Write New Post'}
            </h1>
          </div>

          <form onSubmit={handleSavePost} className="bg-white dark:bg-[#131b2e] rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-white/5 space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Article Title</label>
              <input 
                required
                type="text" 
                value={newPost.title}
                onChange={e => setNewPost({...newPost, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                placeholder="Enter an engaging title..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select 
                    value={newPost.category}
                    onChange={e => setNewPost({...newPost, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Frontend">Frontend Development</option>
                    <option value="Backend">Backend Engineering</option>
                    <option value="AI Engineering">AI Engineering</option>
                    <option value="Career">Career Advice</option>
                    <option value="Tech Trends">Tech Trends</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image URL</label>
                  <input 
                    type="url" 
                    value={newPost.imageUrl}
                    onChange={e => setNewPost({...newPost, imageUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                    placeholder="https://..."
                  />
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Short Excerpt</label>
              <textarea 
                required
                rows={2}
                value={newPost.excerpt}
                onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all resize-none"
                placeholder="A brief summary for the preview card..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <textarea 
                required
                rows={12}
                value={newPost.content}
                onChange={e => setNewPost({...newPost, content: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                placeholder="Write your article here..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button"
                onClick={handleCancelCreate}
                className="px-6 py-3 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all transform hover:-translate-y-1"
              >
                <Save size={18} />
                {isEditing ? 'Update Post' : 'Publish Post'}
              </button>
            </div>

          </form>
        </div>
      </section>
    );
  }

  return null;
};

export default BlogPage;