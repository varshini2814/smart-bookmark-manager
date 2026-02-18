"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";

type Bookmark = { id: string; title: string; url: string; };

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Friend";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const generateParticles = () => setParticles([...Array(20)].map((_, i) => ({
      left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`, animationDuration: `${2 + Math.random() * 2}s`,
    })));
    generateParticles();
  }, []);

  useEffect(() => {
    const getUser = async () => { const { data } = await supabase.auth.getUser(); setUser(data.user); };
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => setUser(session?.user ?? null));
    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchBookmarks = async () => {
    if (!user) return;
    const { data } = await supabase.from("bookmarks").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setBookmarks(data);
  };

  useEffect(() => { if (user) fetchBookmarks(); }, [user]);

  // Fixed: Realtime updates - use void to explicitly avoid returning the Promise
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel("bookmarks-realtime").on("postgres_changes", {
      event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${user.id}`,
    }, () => fetchBookmarks());
    void channel.subscribe(); // Explicitly void to prevent TypeScript error
    return () => supabase.removeChannel(channel);
  }, [user]);

  const addBookmark = async () => {
    if (!title || !url || !user) return;
    await supabase.from("bookmarks").insert([{ title, url, user_id: user.id }]);
    setTitle(""); setUrl("");
  };

  const handleCheckbox = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);

  const deleteSelected = async () => {
    if (selected.length === 0 || !user) return;
    await supabase.from("bookmarks").delete().in("id", selected);
    setSelected([]); setMenuOpen(false); fetchBookmarks();
  };

  const handleLogin = async () => await supabase.auth.signInWithOAuth({ provider: "google" });
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center"></div>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-12 rounded-3xl shadow-2xl text-center animate-fade-in relative z-10">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Welcome to Smart Bookmark Manager 🔖</h1>
          <button onClick={handleLogin} className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-xl">Continue with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-white relative overflow-hidden animate-fade-in">
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex animate-slide-right-to-left" style={{ animation: 'slide-right-to-left 10s linear infinite' }}>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
          <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=1080')] bg-cover bg-center flex-shrink-0"></div>
        </div>
      </div>
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <div key={i} className="absolute w-3 h-3 bg-purple-300 rounded-full opacity-50 animate-bounce" style={{ left: p.left, top: p.top, animationDelay: p.animationDelay, animationDuration: p.animationDuration }}></div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-8 relative">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hi, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent capitalize">{userName}</span><span className="text-white">👋</span></h1>
            <p className="text-gray-400 text-sm">Welcome to Smart Bookmark Manager</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl px-4 py-2 rounded-xl hover:bg-white/20 hover:shadow-lg transition-all duration-300 animate-pulse">⋮</button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-50 animate-slide-in">
                <button onClick={deleteSelected} className="block w-full text-left px-4 py-3 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> Delete Selected
                </button>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 hover:bg-gray-500/20 hover:text-gray-300 transition-all duration-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mb-15">
          <input type="text" placeholder="Enter your Bookmark Title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-purple-900 text-black border border-purple-600 p-4 w-full rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-lg transition-all duration-300" />
          <input type="text" placeholder="Paste here Bookmark URL" value={url} onChange={(e) => setUrl(e.target.value)} className="bg-purple-900 text-black border border-purple-600 p-4 w-full rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:shadow-lg transition-all duration-300" />
          <button onClick={addBookmark} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-300 shadow-xl flex items-center justify-center">➕ Add Bookmark</button>
        </div>
        <div>
          {bookmarks.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-purple-300 flex items-center">🔖 Here are your bookmarks😁</h2>
              {bookmarks.map((bookmark, index) => (
                <div key={bookmark.id} className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-4 flex items-center hover:bg-white/20 hover:shadow-lg transition-all duration-300 animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <input type="checkbox" checked={selected.includes(bookmark.id)} onChange={() => handleCheckbox(bookmark.id)} className="w-5 h-5 accent-purple-500 mr-4 hover:scale-110 transition-transform" />
                  <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 transition-all duration-300 font-medium flex-1">{bookmark.title}</a>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <svg className="w-32 h-32 mx-auto mb-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <h2 className="text-xl font-semibold mb-4 text-purple-300 flex items-center justify-center">📚 No bookmarks yet – start adding some fun links! 🎉</h2>
              <p className="text-gray-400">Hover over the inputs above for examples, then click "Add Bookmark" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}