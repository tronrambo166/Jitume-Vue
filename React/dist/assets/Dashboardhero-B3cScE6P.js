import{G as C,r as n,j as e,K as k,O as S,L as o,g as f,b as D,u as E,c as U,P as L,k as F,x as I,Q as R,R as A,S as z,T as w,U as O,V as B}from"./index-Bfe730sX.js";function H(m){return C({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"},child:[]}]})(m)}const M=()=>{const[m,c]=n.useState(!1),[l,r]=n.useState([]),t=n.useRef(null);n.useEffect(()=>{(()=>{f.get("business/notifications").then(({data:a})=>{r(a.data),console.log("Notifications = "),console.log(a)}).catch(a=>{console.log(a)})})()},[]);const i=l.filter(s=>s.new===1).length,d=()=>{c(s=>!s),i>0&&(r(s=>s.map(a=>({...a,new:0}))),f.get("business/notifSetRead").then(({data:s})=>{console.log(s)}).catch(s=>{console.log(s)}))},p=()=>{r([])},g=s=>{r(a=>a.filter((j,b)=>b!==s))};n.useEffect(()=>{const s=a=>{t.current&&!t.current.contains(a.target)&&c(!1)};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[]);const v=()=>{c(!1)};return e.jsxs("div",{className:"relative",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx(k,{className:"cursor-pointer text-2xl text-white",onClick:d}),i>0&&e.jsx("div",{className:"absolute flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-3",children:i})]}),m&&e.jsxs("div",{ref:t,className:"absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-lg rounded-lg p-4 z-20",children:[e.jsxs("div",{className:"flex justify-between items-center mb-2 border-b border-gray-200 p-2 sticky top-0 bg-white z-10",children:[e.jsx("span",{className:"font-semibold text-gray-700 text-sm",children:"Notifications"}),e.jsx(S,{className:"cursor-pointer text-gray-500 text-xs",onClick:()=>c(!1)})]}),e.jsx("div",{className:"max-h-72 overflow-y-auto scroll-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-lg",children:l.length===0?e.jsx("div",{className:"text-center text-gray-500 text-sm",children:"No notifications"}):e.jsx("ul",{children:l.map((s,a)=>e.jsxs("li",{className:"flex items-start space-x-2 py-2 border-b border-gray-200",children:[e.jsx("div",{className:"w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center",children:e.jsx("span",{className:"text-xl",children:s.icon})}),e.jsxs("div",{className:"text-sm",children:[e.jsx("div",{className:"font-semibold text-gray-800",children:s.name}),e.jsx("div",{className:`${s.new===0?"text-gray-500":"text-gray-800"}`,children:s.text}),e.jsx("div",{className:"text-xs text-gray-500",children:s.date}),e.jsxs("div",{className:"mt-2 flex space-x-2",children:[e.jsx(o,{to:`./${s.link}`,onClick:v,children:e.jsx("button",{className:"text-blue-600 text-xs hover:text-blue-800",children:"View More"})}),e.jsx("button",{className:"text-red-600 text-xs hover:text-red-800",onClick:()=>g(a),children:"Remove"})]})]})]},a))})}),e.jsx("div",{className:"mt-2 flex justify-between items-center",children:e.jsx("button",{className:"text-xs text-blue-600 hover:text-blue-800",onClick:p,children:"Clear All"})})]})]})},V=()=>{const c=D().pathname.split("/").filter(Boolean),l=r=>r.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join("-");return e.jsx("nav",{className:"text-white text-sm md:text-lg","aria-label":"breadcrumb",children:e.jsxs("ol",{className:"flex",children:[e.jsx("li",{children:e.jsx(o,{to:"/",className:"text-white hover:underline",children:"Home"})}),c.map((r,t)=>{const i=`/${c.slice(0,t+1).join("/")}`,d=t===c.length-1;return e.jsxs("li",{className:"flex items-center",children:[e.jsx("span",{className:"mx-1 text-white",children:"/"}),d?e.jsx("span",{className:"text-white",children:l(decodeURIComponent(r))}):e.jsx(o,{to:i,className:"text-white hover:underline",children:l(decodeURIComponent(r))})]},i)})]})})},P=()=>{const{token:m,setToken:c}=E(),l=U(),r=L(),[t,i]=n.useState({}),[d,p]=n.useState(""),[g,v]=n.useState(""),[s,a]=n.useState(!0),{showAlert:j}=F();n.useEffect(()=>{(async()=>{try{const{data:h}=await f.get("/checkAuth");i(h.user),p(h.user.id)}catch{j("error","Failed to load user data. Redirecting..."),l("/")}finally{a(!1)}})()},[]),n.useEffect(()=>{if(!d)return;const x=async()=>{try{const{data:u}=await f.get(`business/service_messages_count/${d}`);v(u.count)}catch(u){console.error("Error fetching messages count:",u)}};x();const h=setInterval(x,2e3);return()=>clearInterval(h)},[d]),n.useEffect(()=>{const x=h=>{const u=h.detail;i(y=>({...y,...u})),console.log("User data updated:",u)};return window.addEventListener("userUpdated",x),()=>{window.removeEventListener("userUpdated",x)}},[]),n.useState(!1),n.useState(!1);const b=x=>{x.preventDefault(),a(!0),f.get("/logout").then(()=>{i(null),c(null),j("success","Logged out successfully"),l("/")}).finally(()=>a(!1))};if(s)return e.jsx("div",{className:"fixed inset-0 flex items-center justify-center bg-gray-100",children:e.jsx("div",{className:"animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"})});let N=!1;return!m&&!N&&(j("error","You are not logged in. Please log in to continue."),l("/"),N=!0),e.jsxs("div",{id:"dashbg",className:"relative max-w-[95%] mx-auto rounded-xl mb-[20px] h-[200px] mt-4 p-4",children:[e.jsxs("div",{className:"flex justify-between items-center flex-wrap",children:[e.jsxs("div",{className:"mb-4 md:mb-0",children:[e.jsx(V,{}),e.jsx("h2",{className:"text-white font-semibold text-base md:text-lg",children:"Dashboard"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs(o,{to:"/",className:"flex text-sm gap-1 items-center text-white",children:[e.jsx(I,{}),e.jsx("span",{children:"Home"})]}),e.jsx("div",{children:m?e.jsxs("div",{onClick:b,className:"flex items-center text-sm gap-2 cursor-pointer text-white",children:[e.jsx(A,{}),e.jsx("span",{children:"Sign Out"})]}):e.jsxs("div",{onClick:()=>l("/home"),className:"flex items-center text-sm gap-2 cursor-pointer text-white",children:[e.jsx("span",{children:"Sign In"}),e.jsx(R,{})," "]})}),e.jsxs(o,{to:"/dashboard/settings",className:"flex items-center space-x-2 hover:text-gray",children:[e.jsx(z,{className:"text-white text-xl"}),e.jsx("span",{className:"text-white text-sm",children:"Settings"})]}),e.jsx(M,{})]})]}),e.jsx("div",{className:"absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full",children:e.jsx("div",{className:"bg-gray-100/50 max-w-[95%] mx-auto px-4 md:px-6 py-3 rounded-lg shadow-lg",children:e.jsxs("div",{className:"flex justify-between items-center flex-wrap gap-4",children:[e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsx("img",{src:t!=null&&t.image?t.image:r,className:"rounded-xl w-16 h-16 md:w-20 md:h-20",alt:"Profile"}),e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("h2",{className:"text-black text-sm md:text-lg font-bold",children:[t.fname," ",t.lname]}),e.jsx("h3",{className:"text-sm md:text-base",children:t.email||"test@email.com"})]})]}),e.jsxs("div",{className:"flex mt-5 text-sm md:text-[13px] gap-4 flex-wrap items-center",children:[e.jsxs(o,{to:"",className:"flex items-center hover:text-green gap-1",children:[e.jsx(H,{}),e.jsx("span",{children:"Overview"})]}),e.jsxs(o,{to:"/dashboard/addbusiness",className:"flex items-center hover:text-green gap-1",children:[e.jsx(w,{}),e.jsx("span",{children:"Add Business"})]}),e.jsxs(o,{to:"/dashboard/add-service",className:"flex items-center hover:text-green gap-1",children:[e.jsx(w,{}),e.jsx("span",{children:"Add Service"})]}),e.jsx(o,{to:"/dashboard/messages",className:"flex items-center hover:text-green gap-1",children:e.jsxs("div",{className:"relative flex items-center gap-1 hover:text-green",children:[e.jsx(O,{}),e.jsx("span",{children:"Messages"}),g>0&&e.jsx("span",{className:"absolute top-[-8px] right-[-10px] inline-flex items-center justify-center w-3 h-3 text-xs font-semibold text-green-200 bg-red-600 rounded-full pulse",children:g})]})}),d&&e.jsxs(o,{to:`./account/${d}`,className:"flex items-center hover:text-green gap-1",children:[e.jsx(B,{}),e.jsx("span",{children:"Account"})]})]})]})})})]})};export{P as default};