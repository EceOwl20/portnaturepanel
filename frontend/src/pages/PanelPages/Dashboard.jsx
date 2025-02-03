// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import ProgressBarExample from './PanelComponents/ProgressBarExample';

// // Chart.js config
// ChartJS.register(
//   LineElement,
//   PointElement,
//   LinearScale,
//   CategoryScale,
//   Title,
//   Tooltip,
//   Legend
// );

// const Dashboard = () => {
//   // STATE: blog, pages, users, metrics
//   const [blogs, setBlogs] = useState([]);
//   const [pages, setPages] = useState([]);
//   const [users, setUsers] = useState([]);

//   const [metrics, setMetrics] = useState(null);

//   // Loading / error states
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Metric Ekleme ile ilgili state
//   const [newName, setNewName] = useState("");
//   const [newTimestamp, setNewTimestamp] = useState("");
//   const [newValue, setNewValue] = useState("");
//   const [message, setMessage] = useState("");

//   //----------------------------------
//   // 1) BLOG FETCH
//   //----------------------------------
//   const fetchBlogs = async () => {
//     try {
//       const response = await fetch("/api/blog/liste");
//       const data = await response.json();
//       // data.success => blog verisi success formatında dönmeli
//       if (data.success) {
//         setBlogs(data.blogs);
//       } else {
//         setError(data.message || "Bloglar Bulunamadı");
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBlogs();
//   }, []);

//   //----------------------------------
//   // 2) PAGES FETCH
//   //----------------------------------
//   const fetchPages = async () => {
//     try {
//       const response = await fetch("/api/page/all");
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to fetch pages");
//       }
//       // 'data' bir dizi ise => setPages(data)
//       setPages(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchPages();
//   }, []);

//   //----------------------------------
//   // 3) METRICS FETCH
//   //----------------------------------
//   const fetchMetrics = async () => {
//     try {
//       const response = await fetch('/api/metric/metrics');
//       if (!response.ok) throw new Error('Veri çekilemedi');

//       const data = await response.json();
//       console.log("Fetched metrics:", data);
//       setMetrics(data);
//     } catch (error) {
//       console.error('Metrik verileri alınamadı:', error);
//       setError(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchMetrics();
//   }, []);

//   //----------------------------------
//   // 4) USERS FETCH
//   //----------------------------------
//   const fetchUsers = async () => {
//     try {
//       // /api/user/all => arka uç { success: true, users: [...] }
//       const response = await fetch("/api/user/all");
//       const data = await response.json();

//       if (data.success) {
//         setUsers(data.users);
//       } else {
//         setError(data.message || "Users Bulunamadı");
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   //----------------------------------
//   // METRIC EKLEME
//   //----------------------------------
//   const handleAddMetric = async (e) => {
//     e.preventDefault();
//     if (!newName || !newTimestamp || !newValue) {
//       alert("Lütfen tüm alanları doldurun");
//       return;
//     }

//     const payload = {
//       name: newName,
//       dataPoints: [
//         { timestamp: newTimestamp, value: Number(newValue) },
//       ],
//     };

//     try {
//       const res = await fetch('/api/metric', {
//         method: 'POST',
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error("Ekleme/upsert başarısız");

//       const result = await res.json();
//       setMessage(result.message || "Ekleme/upsert başarılı");

//       // Form reset
//       setNewName("");
//       setNewTimestamp("");
//       setNewValue("");

//       // Yeniden metrics çek
//       fetchMetrics();
//     } catch (err) {
//       console.error("handleAddMetric error:", err);
//     }
//   };

//   //----------------------------------
//   // 1) LOADING / ERROR CHECK
//   //----------------------------------
//   if (loading) return <p>Yükleniyor...</p>; 
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   //----------------------------------
//   // 2) METRICS GRAFİKLERİ
//   //----------------------------------
//   // Metric verisi yoksa
//   if (!metrics) return <p>Metrics verisi alınamadı</p>;

//   const networkData = metrics.find((m) => m.name === 'network.bytesIn');
//   const connectionData = metrics.find((m) => m.name === 'connections.current');
//   const opCounterData = metrics.find((m) => m.name === 'opcounters');

//   if (!networkData || !connectionData || !opCounterData) {
//     return <p>Gerekli metrics yok</p>;
//   }

//   // network
//   const chartData = {
//     labels: networkData.dataPoints.map((p) => new Date(p.timestamp).toLocaleTimeString()),
//     datasets: [{
//       label: 'Network Bytes In',
//       data: networkData.dataPoints.map((p) => p.value),
//       borderColor: 'rgba(75,192,192,1)',
//       fill: false,
//     }],
//   };

//   // connections
//   const chartData2 = {
//     labels: connectionData.dataPoints.map((p) => new Date(p.timestamp).toLocaleTimeString()),
//     datasets: [{
//       label: 'Current Connections',
//       data: connectionData.dataPoints.map((p) => p.value),
//       borderColor: 'rgba(255,99,132,1)',
//       fill: false,
//     }],
//   };

//   // opCounter
//   const opChartData = {
//     labels: opCounterData.dataPoints.map((p) => new Date(p.timestamp).toLocaleTimeString()),
//     datasets: [{
//       label: 'Opcounters',
//       data: opCounterData.dataPoints.map((p) => p.value),
//       borderColor: 'rgba(54,162,235,1)',
//       fill: false,
//     }],
//   };

//   const options = { responsive: true, scales: { x:{ ticks:{ color:'green' } }, y:{ ticks:{ color:'purple' } } } };

//   //----------------------------------
//   // 3) RETURN (JSX)
//   //----------------------------------
//   return (
//     <div className='flex flex-col w-[98%] items-start justify-start h-full text-white px-[2%] py-5'>
//       <h1 className='text-2xl mb-4 text-white font-semibold'>Dashboard</h1>

//       <div className='flex w-full items-start justify-between'>
//         {/* LEFT SIDE (Charts) */}
//         <div className='w-[70%] grid grid-cols-2 mt-2 gap-4'>
//           <div className='flex flex-col bg-white p-4 gap-10 rounded-md text-[#0e0c1b]'>
//             <h2 className='text-[20px]'>Network Grafiği</h2>
//             <Line data={chartData} options={options} />
//           </div>

//           <div className='flex flex-col bg-white p-4 gap-10 rounded-md text-[#0e0c1b]'>
//             <h2 className='text-[20px]'>Connections Grafiği</h2>
//             <Line data={chartData2} options={options} />
//           </div>

//           <div className='flex flex-col bg-white p-4 gap-10 rounded-md text-[#0e0c1b]'>
//             <h2 className='text-[20px]'>Opcounters Grafiği</h2>
//             <Line data={opChartData} options={options} />
//           </div>
//         </div>

//         {/* RIGHT SIDE (Stats) */}
//         <div className='flex flex-col items-center justify-start w-[24%] gap-2 mt-0'>
//           {/* PAGE */}
//           <div className='flex flex-col items-start justify-start w-[80%] p-[5%] bg-[#0e0c1b] rounded-lg'>
//             <span className='text-[25px] font-medium'>{pages.length}</span>
//             <p className='text-[18px] font-medium mb-3'>Sayfa</p>
//             <ProgressBarExample currentValue={pages.length} targetValue={100} />
//           </div>

//           {/* BLOG */}
//           <div className='flex flex-col items-start justify-start w-[80%] p-[5%] bg-[#0e0c1b] rounded-lg'>
//             <span className='text-[25px] font-medium'>{blogs.length}</span>
//             <p className='text-[18px] font-medium'>Blog</p>
//             <ProgressBarExample currentValue={blogs.length} targetValue={50} />
//           </div>

//           {/* USER */}
//           <div className='flex flex-col items-start justify-start w-[80%] p-[5%] bg-[#0e0c1b] rounded-lg'>
//             <span className='text-[25px] font-medium'>{users.length}</span>
//             <p className='text-[18px] font-medium'>Kullanıcı</p>
//             <ProgressBarExample currentValue={users.length} targetValue={50} />
//           </div>
//         </div>
//       </div>

//       {/* Metric Ekleme Formu */}
//       <div className='my-5 bg-[#0e0c1b] text-white p-4 rounded mt-[600px] '>
//         <h2 className='text-lg font-semibold mb-2'>Yeni Metric Ekle / Var Olanı Güncelle</h2>
//         <form onSubmit={handleAddMetric} className='flex gap-4 items-center'>
//           <div>
//             <label>Metric Name:</label>
//             <input 
//               type="text"
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               className='border px-2 py-1 text-black'
//             />
//           </div>
//           <div>
//             <label>Timestamp:</label>
//             <input 
//               type="datetime-local"
//               value={newTimestamp}
//               onChange={(e) => setNewTimestamp(e.target.value)}
//               className='border px-2 py-1 text-black'
//             />
//           </div>
//           <div>
//             <label>Value:</label>
//             <input 
//               type="number"
//               value={newValue}
//               onChange={(e) => setNewValue(e.target.value)}
//               className='border px-2 py-1 text-black'
//             />
//           </div>
//           <button type='submit' className='bg-[#6b78ad] text-white px-3 py-1 rounded'>Ekle/Upsert</button>
//         </form>
//         {message && <p className='mt-2 text-green-700'>{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
