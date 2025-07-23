// 'use client';

// import React, { useRef, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import HTMLFlipBook from 'react-pageflip';
// import { Button, Upload, Spin, Slider, Typography, Space, message } from 'antd';
// import {
//   LeftOutlined,
//   RightOutlined,
//   UploadOutlined,
//   ZoomInOutlined,
//   ZoomOutOutlined,
//   DownloadOutlined,
// } from '@ant-design/icons';
// import type { UploadProps } from 'antd';

// import styles from './PdfBookViewer.module.scss';

// // Sử dụng phiên bản cụ thể của pdf.js để đảm bảo ổn định
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

// const { Title } = Typography;

// const PdfBookViewer: React.FC = () => {
//   const [pdfFile, setPdfFile] = useState<string | null>(null);
//   const [numPages, setNumPages] = useState<number>(0);
//   const [scale, setScale] = useState<number>(1.2);
//   const [currentPage, setCurrentPage] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const flipBookRef = useRef<any>(null);

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     console.log('Số trang:', numPages);
//     setNumPages(numPages);
//     setIsLoading(false);
//   };

//   const props: UploadProps = {
//     accept: '.pdf',
//     showUploadList: false,
//     beforeUpload: (file) => {
//       if (file.type !== 'application/pdf') {
//         message.error('Vui lòng chọn file PDF!');
//         return false;
//       }
//       setIsLoading(true);
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         if (e.target.result) {
//           setPdfFile(e.target.result);
//           setCurrentPage(0);
//         } else {
//           message.error('Không thể đọc file PDF!');
//           setIsLoading(false);
//         }
//       };
//       reader.onerror = () => {
//         message.error('Lỗi khi đọc file PDF!');
//         setIsLoading(false);
//       };
//       reader.readAsDataURL(file);
//       return false;
//     },
//   };

//   const handleZoom = (direction: 'in' | 'out') => {
//     setScale((prev) =>
//       direction === 'in' ? prev + 0.2 : Math.max(0.6, prev - 0.2)
//     );
//   };

//   const handlePageChange = (direction: 'prev' | 'next') => {
//     if (!flipBookRef.current) return;
//     direction === 'next'
//       ? flipBookRef.current.pageFlip().flipNext()
//       : flipBookRef.current.pageFlip().flipPrev();
//   };

//   const downloadFile = () => {
//     if (!pdfFile) return;
//     const link = document.createElement('a');
//     link.href = pdfFile;
//     link.download = 'file.pdf';
//     link.click();
//   };

//   return (
//     <div className={styles.viewerContainer}>
//       <Title level={3}>PDF Book Viewer</Title>

//       <Space style={{ marginBottom: 16 }}>
//         <Upload {...props}>
//           <Button icon={<UploadOutlined />}>Tải PDF lên</Button>
//         </Upload>

//         <Button icon={<ZoomInOutlined />} onClick={() => handleZoom('in')}>
//           Zoom In
//         </Button>
//         <Button icon={<ZoomOutOutlined />} onClick={() => handleZoom('out')}>
//           Zoom Out
//         </Button>
//         <Button icon={<DownloadOutlined />} onClick={downloadFile}>
//           Tải xuống
//         </Button>
//       </Space>

//       {pdfFile ? (
//         <Spin spinning={isLoading}>
//           <div className={styles.bookWrapper} style={{ display: 'flex', alignItems: 'center' }}>
//             <Button
//               icon={<LeftOutlined />}
//               onClick={() => handlePageChange('prev')}
//               disabled={currentPage === 0}
//             />

//             <HTMLFlipBook
//               width={600}
//               height={800}
//               size="stretch"
//               minWidth={315}
//               maxWidth={1000}
//               minHeight={420}
//               maxHeight={1500}
//               maxShadowOpacity={0.5}
//               showCover={true}
//               mobileScrollSupport={true}
//               startPage={0}
//               drawShadow={true}
//               flippingTime={1000}
//               useMouseEvents={true}
//               clickEventForward={true}
//               usePortrait={true}
//               startZIndex={0}
//               autoSize={true}
//               showPageCorners={true}
//               disableFlipByClick={false}
//               swipeDistance={30}
//               className="pdf-book-viewer"
//               onFlip={(e) => {
//                 console.log('Trang hiện tại:', e.data);
//                 setCurrentPage(e.data);
//               }}
//               ref={flipBookRef}
//               style={{ margin: '0 auto' }}
//             >
//               {Array.from(new Array(numPages), (_, index) => (
//                 <div key={`page_${index + 1}`} className="pdf-page">
//                   <Document
//                     file={pdfFile}
//                     onLoadSuccess={onDocumentLoadSuccess}
//                     onLoadError={(error) => {
//                       console.error('Lỗi khi tải PDF:', error);
//                       message.error('Không thể tải file PDF!');
//                       setIsLoading(false);
//                     }}
//                     loading=""
//                   >
//                     <Page
//                       pageNumber={index + 1}
//                       scale={scale}
//                       loading={<Spin />}
//                       onRenderSuccess={() => console.log(`Render trang ${index + 1}`)}
//                     />
//                   </Document>
//                 </div>
//               ))}
//             </HTMLFlipBook>

//             <Button
//               icon={<RightOutlined />}
//               onClick={() => handlePageChange('next')}
//               disabled={currentPage >= numPages - 1}
//             />
//           </div>

//           <div style={{ marginTop: 16, textAlign: 'center' }}>
//             <Slider
//               min={0}
//               max={numPages - 1}
//               value={currentPage}
//               onChange={(page) => {
//                 setCurrentPage(page);
//                 flipBookRef.current?.pageFlip()?.flip(page);
//               }}
//               tooltip={{ formatter: (val) => `Trang ${val! + 1}` }}
//               style={{ width: 300, margin: '0 auto' }}
//             />
//             <p>Trang {currentPage + 1} / {numPages}</p>
//           </div>
//         </Spin>
//       ) : (
//         <p>Vui lòng tải lên file PDF để bắt đầu.</p>
//       )}
//     </div>
//   );
// };

// export default PdfBookViewer;
