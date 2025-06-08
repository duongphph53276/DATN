import React, { useEffect, useState } from 'react';
import './style.css'; // Import CSS gốc
import { Helmet } from 'react-helmet-async';

const NotFound: React.FC = () => {
  const [isVietnamese, setIsVietnamese] = useState(false);

  useEffect(() => {
    // Tạo thẻ <link> cho Bootstrap
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css';
    
    // Tạo thẻ <link> cho font Arvo
    const arvoLink = document.createElement('link');
    arvoLink.rel = 'stylesheet';
    arvoLink.href = 'https://fonts.googleapis.com/css?family=Arvo';

    // Thêm vào <head>
    document.head.appendChild(bootstrapLink);
    document.head.appendChild(arvoLink);

    // Kiểm tra địa chỉ IP
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        if (data.country === 'VN') {
          setIsVietnamese(true);
        }
      });

    // Cleanup: Gỡ bỏ khi component unmount
    return () => {
      document.head.removeChild(bootstrapLink);
      document.head.removeChild(arvoLink);
    };
  }, []); // Chỉ chạy một lần khi mount

  return (
    <>
    <Helmet>
      <title>404 Not Found</title>
    </Helmet>
    <section className="page_404" dangerouslySetInnerHTML={{
      __html: `
        <div class="container">
          <div class="row">
            <div class="col-sm-12 ">
              <div class="col-sm-10 col-sm-offset-1 text-center">
                <div class="four_zero_four_bg">
                  <h1 class="text-center ">404</h1>
                </div>
                <div class="contant_box_404">
                  <h3 class="h2">${isVietnamese ? 'Có vẻ như bạn đã lạc' : 'Look like you\'re lost'}</h3>
                  <p>${isVietnamese ? 'Trang bạn đang tìm kiếm không khả dụng!' : 'The page you are looking for is not available!'}</p>
                  <a href="/" class="link_404">${isVietnamese ? 'Về trang chủ' : 'Go to Home'}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }} />
    </>
  );
};

export default NotFound;