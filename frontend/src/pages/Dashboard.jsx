import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
 
const Dashboard = () => { 
  const [campaigns, setCampaigns] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(true); 
 
  useEffect(() => { 
    const fetchCampaigns = async () => { 
      try { 
        const res = await axios.get("http://localhost:5000/api/campaigns/all"); 
        setCampaigns(res.data); 
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      } 
    }; 
    fetchCampaigns(); 
  }, []); 
 
  const filteredCampaigns = campaigns.filter((camp) => 
    camp.title.toLowerCase().includes(searchTerm.toLowerCase()) 
  ); 
 
  return ( 
    // Added pt-24 so content isn't hidden behind the fixed Navbar 
    <div className="pt-24 px-6 pb-12"> 
      {/* Header */} 
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify
between items-center gap-4"> 
        <h1 className="text-4xl font-bold text-white drop-shadow-md"> 
          Active Campaigns 🌍 
        </h1> 
        <input 
          type="text" 
          placeholder="🔍 Search campaigns..." 
          className="p-3 w-full md:w-80 rounded-full bg-white/10 border border
white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 
focus:ring-blue-500 backdrop-blur-sm transition" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        /> 
      </div> 
 
      {loading ? ( 
        <div className="text-center mt-20 text-blue-300 animate-pulse text-xl"> 
          Loading... 
        </div> 
      ) : filteredCampaigns.length === 0 ? ( 
        <div className="text-center mt-20 text-gray-400 text-xl"> 
          No campaigns found matching "{searchTerm}" 
        </div> 
      ) : ( 
        /* Grid */ 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"> 
          {filteredCampaigns.map((camp) => ( 
            // ✨ GLASS CARD: bg-white/10 + backdrop-blur 
            <div 
              key={camp._id} 
              className="rounded-2xl overflow-hidden bg-white/10 border border
white/10 backdrop-blur-md shadow-xl hover:-translate-y-2 transition-all duration
300" 
            > 
              {/* Image with aspect-video to force same size */} 
              <img 
                src={camp.image} 
                alt={camp.title} 
                className="w-full aspect-video object-cover" 
              /> 
 
              <div className="p-5"> 
                <h3 className="text-xl font-bold mb-2 text-white truncate"> 
                  {camp.title} 
                </h3> 
                <p className="text-gray-300 text-sm mb-4 line-clamp-2"> 
                  {camp.description} 
                </p> 
 
                {/* Progress Bar */} 
                <div className="w-full bg-gray-700/50 rounded-full h-2 mb-3"> 
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 
rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" 
                    style={{ 
                      width: `${Math.min( 
                        (camp.currentAmount / camp.targetAmount) * 100, 
                        100 
                      )}%`, 
                    }} 
                  ></div> 
                </div> 
 
                <div className="flex justify-between text-sm font-medium text
gray-300 mb-4"> 
                  <span className="text-cyan-300 font-bold"> 
                    ${camp.currentAmount} raised 
                  </span> 
                  <span>Goal: ${camp.targetAmount}</span> 
                </div> 
 
                <button className="w-full py-2 rounded-lg font-bold text-sm bg
white/10 hover:bg-white/20 border border-white/20 text-white transition"> 
                  View Details (W3) 
                </button> 
              </div> 
            </div> 
          ))} 
        </div> 
      )} 
    </div> 
  ); 
}; 
 
export default Dashboard; 