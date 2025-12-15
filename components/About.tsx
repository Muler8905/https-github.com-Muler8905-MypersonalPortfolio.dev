import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, MapPin, Calendar, BookOpen, Cpu, Camera, RefreshCw } from 'lucide-react';

interface AboutProps {
  onBack?: () => void;
}

const DEFAULT_PROFILE_IMG = 'https://api.dicebear.com/9.x/lorelei/svg?seed=Muluken&backgroundColor=b6e3f4&hair=variant04&eyes=variant04';
const FALLBACK_PROFILE_IMG = 'https://api.dicebear.com/9.x/lorelei/svg?seed=Felix&backgroundColor=ffdfbf';

const About: React.FC<AboutProps> = ({ onBack }) => {
  // Primary: Anime-style Avatar (Lorelei style is specifically Anime)
  // Fallback: Alternative Anime Avatar seed
  const [profileImg, setProfileImg] = useState(DEFAULT_PROFILE_IMG);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load saved image from local storage if exists
    const savedImage = localStorage.getItem('about_profile_image');
    if (savedImage) {
      setProfileImg(savedImage);
    }
  }, []);

  const handleProfileError = () => {
    // Fallback to another anime avatar if the first fails, but avoid loops
    if (profileImg !== FALLBACK_PROFILE_IMG) {
        setProfileImg(FALLBACK_PROFILE_IMG);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Create canvas for resizing/compression
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set max dimensions (e.g., 800x800)
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining aspect ratio
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            
            // Draw image to canvas
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Compress to JPEG with 0.7 quality to ensure it fits in localStorage
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            setProfileImg(compressedBase64);
            try {
                localStorage.setItem('about_profile_image', compressedBase64);
            } catch (error) {
                console.error("Image too large to save:", error);
                alert("Image is too large to save to local storage, but it will be shown for this session.");
            }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setProfileImg(DEFAULT_PROFILE_IMG);
      localStorage.removeItem('about_profile_image');
  };

  const triggerFileInput = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      fileInputRef.current?.click();
  };

  return (
    <section className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="bg-white dark:bg-[#131b2e] rounded-3xl shadow-xl dark:shadow-none border border-gray-200 dark:border-white/5 overflow-hidden">
          
          {/* Header Image / Banner */}
          <div className="relative h-48 md:h-64 w-full overflow-hidden">
             {/* Gradient overlay removed for clear view of banner */}
             <img 
               src="https://media.licdn.com/dms/image/v2/D4D16AQHgDIa-WaS3iw/profile-displaybackgroundimage-shrink_350_1400/B4DZo2MeOSKIAc-/0/1761845833705?e=1767225600&v=beta&t=eQesyafC0hNNtFye3gpriL_yEXEQ-eegF7aLC-CMcR8" 
               alt="Workspace Banner" 
               className="w-full h-full object-cover"
             />
          </div>

          {/* Profile Section with Avatar Overlay */}
          <div className="px-8 md:px-12 relative">
             <div className="-mt-16 md:-mt-20 mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 relative z-20">
                <div className="relative group">
                   <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#131b2e] shadow-xl overflow-hidden bg-white relative">
                      <img 
                        src={profileImg}
                        onError={handleProfileError}
                        alt="Muluken Ugamo"
                        className="w-full h-full object-cover bg-gray-100"
                      />
                      
                      {/* Upload Controls Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <input 
                               type="file" 
                               ref={fileInputRef} 
                               className="hidden" 
                               accept="image/*"
                               onChange={handleImageUpload}
                           />
                           <button 
                               onClick={triggerFileInput}
                               className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-violet-600 transition-all shadow-lg"
                               title="Upload New Photo"
                           >
                               <Camera size={18} />
                           </button>
                           <button 
                               onClick={handleResetImage}
                               className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all shadow-lg"
                               title="Reset to Default"
                           >
                               <RefreshCw size={18} />
                           </button>
                      </div>
                   </div>
                   <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-[#131b2e] rounded-full z-10"></div>
                </div>
                
                <div className="flex-1 pt-2 md:pb-4">
                   <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">Muluken Ugamo</h1>
                   <p className="text-violet-600 dark:text-violet-400 font-medium">Software Engineer & Full Stack Developer</p>
                </div>

                <div className="hidden md:block pb-4">
                    <a href="mailto:mulukenugamo8@gmail.com" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-violet-500/20">
                       Contact Me
                    </a>
                </div>
             </div>

             <div className="h-px bg-gray-100 dark:bg-white/5 my-8"></div>
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-violet-500/20 transition-colors">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Location</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dire Dawa City, Ethiopia</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-violet-500/20 transition-colors">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Experience</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Software Engineering (Class of 2027)</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-violet-500/20 transition-colors">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Core Focus</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Stack Web & AI Integration</p>
                  </div>
               </div>
               <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-violet-500/20 transition-colors">
                   <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400">
                     <BookOpen size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900 dark:text-white">Education</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Dire Dawa University</p>
                   </div>
                </div>
            </div>

            {/* Main Content Text */}
            <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-light">
              <p>
                My name is <strong className="text-gray-900 dark:text-white font-medium">Muluken Ugamo</strong>. I am originally from Aleta Wendo, Southern Sidama Regional State, Ethiopia, and currently residing in <strong className="text-gray-900 dark:text-white font-medium">Dire Dawa city</strong>. My journey in technology truly began in 2023, when I joined Dire Dawa University and was admitted to the Software Engineering department. That moment marked a major turning point in my life.
              </p>
              
              <div className="my-8 pl-6 border-l-4 border-violet-500 italic text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-white/5 p-6 rounded-r-xl">
                "I enjoy turning ideas into real, working solutions and using technology to solve social and community-based problems—this purpose keeps me motivated and energized every day."
              </div>

              <p>
                Since then, I have been deeply passionate about exploring the tech industry and continuously expanding my skills. I actively pursue full-stack development, learning from multiple resources and pushing myself through self-driven practice and experimentation.
              </p>

              <p>
                Currently, I am a full-stack developer with an open and growth-oriented mindset. I am always eager to learn new technologies, improve my skills, and move forward. Looking ahead, I am especially interested in artificial intelligence and excited to explore, contribute to, and grow within the AI industry.
              </p>
            </div>

            {/* Resume/Action Area */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
               <button onClick={onBack} className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-violet-500/20">
                 View Portfolio
               </button>
               <a href="mailto:mulukenugamo8@gmail.com" className="md:hidden px-8 py-3 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-white/10 transition-colors text-center">
                 Get in Touch
               </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;