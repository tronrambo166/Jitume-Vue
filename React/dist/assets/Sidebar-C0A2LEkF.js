import{G as g,j as e,s as u,r,g as j,L as b,l as v,t as n,v as y,w as d,x as o,y as c,z as f,B as w,D as N,E as k,H as C}from"./index-BuL6GU2f.js";function $(a){return g({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 6h16v2H4V6zm0 12v-6h16.001l.001 6H4z"},child:[]},{tag:"path",attr:{d:"M6 14h6v2H6z"},child:[]}]})(a)}const L=({toggleSidebar:a})=>e.jsx("button",{onClick:a,className:"fixed top-4 right-4 z-50 p-2 bg-white border rounded-md shadow-md md:hidden","aria-label":"Toggle Sidebar",children:e.jsx(u,{size:24})}),S=()=>{const[a,s]=r.useState(!1),i=r.useRef(null),[m,p]=r.useState(null),h=()=>{s(!a)},x=()=>{window.innerWidth>=768?s(!0):s(!1)},l=t=>{i.current&&!i.current.contains(t.target)&&s(!1)};return r.useEffect(()=>(j.get("business/getCurrSubscription/").then(t=>{console.log(t),p(t.data.mySub.id)}),x(),window.addEventListener("resize",x),document.addEventListener("mousedown",l),()=>{window.removeEventListener("resize",x),document.removeEventListener("mousedown",l)}),[]),e.jsxs(e.Fragment,{children:[!a&&e.jsx(L,{toggleSidebar:h}),e.jsxs("div",{ref:i,className:`scroll-container fixed top-0 left-0 h-screen w-64 bg-white border flex flex-col transition-transform duration-300 z-40 overflow-y-auto
                    ${a?"translate-x-0":"-translate-x-full"} md:translate-x-0`,children:[e.jsx("div",{className:"flex items-center justify-between p-4 border-b border-gray-200",children:e.jsx(b,{className:"flex items-center",to:"/",children:e.jsx("img",{src:v,alt:"Logo",className:"w-[120px] transition-transform duration-300"})})}),e.jsx("div",{children:e.jsxs("ul",{className:"space-y-2",children:[e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(y,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"Dashboard"})]})})}),e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-3 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/my-businesses",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(d,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"My Businesses"})]})})}),e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/milestones",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(o,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"Business Milestones"})]})})}),e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/add-milestone",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(c,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"Add Business Milestone"})]})})}),e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/investment-bids",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(f,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"Business Bids"})]})})}),e.jsx("hr",{}),e.jsxs("ul",{className:"space-y-2 mt-6",children:[e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-3 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/services-table",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(w,{className:`w-4 h-4 sm:w-5 sm:h-5 ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"My Services"})]})})}),e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/add-service",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(d,{className:`w-4 h-4 sm:w-5 sm:h-5 ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"Add Service"})]})})}),e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-3 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/service-milestone",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(o,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"Service Milestones"})]})})}),e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/addservicemilestone",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(c,{className:`w-4 h-4 sm:w-5 sm:h-5 ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"Add Service Milestone"})]})})}),e.jsx("li",{className:"nav-item py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/service-bookings",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(N,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"Service Booking"})]})})}),e.jsx("li",{className:"nav-item mb-6 rounded-xl py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/mybookings",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx(k,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"My Bookings"})]})})}),e.jsx("li",{className:"nav-item mb-6 rounded-xl py-2",children:e.jsx(n,{className:({isActive:t})=>`navLink flex items-center gap-4 py-2 px-4  rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300 ${t?"bg-green-800 text-white":"hover:bg-gray-200 text-gray-400"}`,to:"/dashboard/my-subscription",end:!0,onClick:()=>s(!1),children:({isActive:t})=>e.jsxs(e.Fragment,{children:[e.jsx($,{className:`text-[18px] ${t?"text-white":"text-green"}`}),e.jsx("span",{children:"My Subscriptions"})]})})}),m&&e.jsxs("button",{className:`navLink flex items-center gap-4 py-2 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300
                                            bg-green-800 text-white`,onClick:cancelSubscription,children:[e.jsx(C,{}),e.jsx("span",{children:"Cancel Subscription"})]}),e.jsx("li",{className:"nav-item mb-6 rounded-xl py-2",children:e.jsx(n,{className:({isActive:t})=>"navLink flex items-center gap-4 px-4 rounded text-[12px] sm:text-[14px] md:text-[16px] transition-colors duration-300"})})]})]})})]})]})};export{S as default};