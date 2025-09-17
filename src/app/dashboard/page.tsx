'use client';

import { Card, CardBody, CardHeader, Skeleton, Button, Divider } from '@nextui-org/react';
import { FiBarChart2, FiTrendingUp, FiUsers, FiGlobe } from 'react-icons/fi';
import { motion } from 'framer-motion';
import 'chart.js/auto';
import Blogs from './blogs/page';

function DashboardMain() {
  // return (
  //   <div className="flex flex-col min-h-screen bg-gray-50 ">
  //     {/* Header Section */}
  //     <motion.div 
  //       initial={{ opacity: 0, y: -20 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{ duration: 0.5 }}
  //       className="bg-white shadow-sm"
  //     >
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  //         <div className="text-center">
  //           <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
  //             Website Analytics
  //           </h1>
  //           <p className="mt-4 text-lg text-gray-600  max-w-3xl mx-auto">
  //             Enhance your website's performance tracking with advanced analytics. Choose between Google Analytics integration or leverage powerful third-party tools like Semrush for comprehensive insights.
  //           </p>
  //           <div className="mt-8 flex justify-center gap-4">
  //             <Button
  //               color="primary"
  //               variant="flat"
  //               startContent={<FiGlobe className="text-lg" />}
  //               className="font-medium"
  //             >
  //               Connect Google Analytics
  //             </Button>
  //             <Button
  //               color="primary"
  //               variant="solid"
  //               startContent={<FiTrendingUp className="text-lg" />}
  //               className="font-medium"
  //               as="a"
  //               href="https://www.semrush.com/"
  //               target="_blank"
  //               rel="noopener noreferrer"
  //             >
  //               Explore Semrush
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </motion.div>

  //     {/* Main Content */}
  //     <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //         {/* Analytics Overview Card */}
  //         <motion.div
  //           initial={{ opacity: 0, x: -20 }}
  //           animate={{ opacity: 1, x: 0 }}
  //           transition={{ duration: 0.5, delay: 0.2 }}
  //         >
  //           <Card className="h-full">
  //             <CardHeader className="flex gap-3">
  //               <FiBarChart2 className="text-2xl text-primary" />
  //               <div className="flex flex-col">
  //                 <p className="text-lg font-semibold">Analytics Overview</p>
  //                 <p className="text-sm text-gray-500 ">Key metrics and insights</p>
  //               </div>
  //             </CardHeader>
  //             <Divider />
  //             <CardBody>
  //               <Skeleton className="rounded-lg">
  //                 <div className="h-[300px] rounded-lg bg-default-300"></div>
  //               </Skeleton>
  //             </CardBody>
  //           </Card>
  //         </motion.div>

  //         {/* User Engagement Card */}
  //         <motion.div
  //           initial={{ opacity: 0, x: 20 }}
  //           animate={{ opacity: 1, x: 0 }}
  //           transition={{ duration: 0.5, delay: 0.3 }}
  //         >
  //           <Card className="h-full">
  //             <CardHeader className="flex gap-3">
  //               <FiUsers className="text-2xl text-primary" />
  //               <div className="flex flex-col">
  //                 <p className="text-lg font-semibold">User Engagement</p>
  //                 <p className="text-sm text-gray-500 ">Visitor behavior and interactions</p>
  //               </div>
  //             </CardHeader>
  //             <Divider />
  //             <CardBody>
  //               <Skeleton className="rounded-lg">
  //                 <div className="h-[300px] rounded-lg bg-default-300"></div>
  //               </Skeleton>
  //             </CardBody>
  //           </Card>
  //         </motion.div>
  //       </div>

  //       {/* Features Section */}
  //       <motion.div
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.5, delay: 0.4 }}
  //         className="mt-8"
  //       >
  //         <Card>
  //           <CardBody>
  //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //               <div className="flex flex-col items-center text-center p-4">
  //                 <div className="p-3 rounded-full bg-primary-50  mb-4">
  //                   <FiTrendingUp className="text-2xl text-primary" />
  //                 </div>
  //                 <h3 className="text-lg font-semibold mb-2">Performance Tracking</h3>
  //                 <p className="text-sm text-gray-600 ">
  //                   Monitor website performance and user engagement metrics
  //                 </p>
  //               </div>
  //               <div className="flex flex-col items-center text-center p-4">
  //                 <div className="p-3 rounded-full bg-primary-50  mb-4">
  //                   <FiUsers className="text-2xl text-primary" />
  //                 </div>
  //                 <h3 className="text-lg font-semibold mb-2">User Insights</h3>
  //                 <p className="text-sm text-gray-600 ">
  //                   Understand user behavior and optimize content accordingly
  //                 </p>
  //               </div>
  //               <div className="flex flex-col items-center text-center p-4">
  //                 <div className="p-3 rounded-full bg-primary-50  mb-4">
  //                   <FiGlobe className="text-2xl text-primary" />
  //                 </div>
  //                 <h3 className="text-lg font-semibold mb-2">SEO Analytics</h3>
  //                 <p className="text-sm text-gray-600 ">
  //                   Track search rankings and optimize for better visibility
  //                 </p>
  //               </div>
  //             </div>
  //           </CardBody>
  //         </Card>
  //       </motion.div>
  //     </div>

  //     {/* Footer */}
  //     <footer className="bg-white shadow-sm mt-auto">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  //         <div className="text-center text-gray-500 ">
  //           <p>© {new Date().getFullYear()} NeeviStudio. All rights reserved.</p>
  //           <p className="text-sm mt-1">Powered by advanced analytics and insights</p>
  //         </div>
  //       </div>
  //     </footer>
  //   </div>
  // );

  return <Blogs />
}

export default DashboardMain;
