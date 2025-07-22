import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { SiBuymeacoffee } from "react-icons/si";
import QRCode from 'react-qr-code';
import { TbCopy } from "react-icons/tb";
import __tick__ from '../assets/tick.svg';
import { RiLinksFill } from "react-icons/ri";
import __dev__ from '../assets/dev.jpg';
import '../styles/payMe.scss';


const PayMePage = () => {
  const UPI_ID = 'br7007612@oksbi';
  const DEV_NAME = 'Rudra Saha';
  const AFTER_MSG = 'Thank you for your support!';
  const [isCopied, setIsCopied] = React.useState(false);
  
  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      console.log('UPI ID copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy UPI ID: ', err);
    });
  };

  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(DEV_NAME)}&tn=${encodeURIComponent(AFTER_MSG)}&cu=INR`;

  return (
    <div className="pay-me-content">
      <div className="pay-me-header">
        <FaHeart className="heart-icon" />
        <h2>Support Big(O)wl Development</h2>
        <p style={{marginBottom:'6px'}}>Help keep this project alive and growing!</p>
        <p onClick={() => window.open('https://github.com/Rudrajiii/Big-O-wl', '_blank')} style={{ padding: '4px 10px', cursor:'pointer', background:'rgba(255, 255, 255, 0.1)',  borderRadius: '5px', width: 'fit-content' , margin:'auto'}}>
          {/* let users star the github repo and ask them for star which helps to grow this project */}
          ⭐ Star On GitHub 
        </p>
      </div>

      <div className="support-cards">
        <div className="support-card">
          <SiBuymeacoffee className="card-icon -type-coffee" />
          <h3>Buy me a coffee
            <RiLinksFill size={20} style={{ verticalAlign:'middle', marginLeft:'4px' }}/>
          </h3>
        </div>

        <div className="support-card github-center">
          <FaRegHeart className="card-icon -type-github" />
          <h3>Become a GitHub sponsor
            <RiLinksFill size={20} style={{ verticalAlign:'middle', marginLeft:'4px' }}/>
          </h3>
        </div>

        <div className="support-card upi-card">
          {/* <MdQrCode2 className="card-icon" /> */}
          <h3>UPI Payment</h3>
          {
            isCopied ? 
            (
              <img src={__tick__} alt="Copied" className="copy-icon" />
            )
            :
            (
              <TbCopy size={15} className="copy-icon" onClick={copyUpiId} />
            )
          }
          
          <p>Scan QR or copy UPI ID</p>
          <div className="upi-content">
            <div className="qr-code">
              <QRCode
                value={upiUrl}
                size={120}
                style={{ height: 'auto' }}
                bgColor="#ffffff"
                fgColor="#000000"
              />
              <p>UPI ID: {UPI_ID}
                <br />
                Your support means a lot to us!!
              </p>
            </div>
            
          </div>
        </div>

        
      </div>

      <div className="developer-info">
        <div className="developer-card">
          <div className="developer-avatar">
            <img src={__dev__} alt="rudra" />
          </div>
          <div className="developer-details">
            <h3>About the Developer</h3>
            <p>
              Hey Devs!! myself Rudra :) passionate about creating tools that help developers analyze and optimize their code. 
              Big(O)wl is designed to make algorithmic complexity analysis accessible and intuitive.
            </p>
            <p>
              Your support helps me dedicate more time to improving this extension and building new features!
            </p>
          </div>
        </div>
      </div>


      <div className="thank-you">
        <FaHeart className="thank-you-heart" />
        <h3>Thank you for your support! ❤️</h3>
        <p>Every contribution helps make Big(O)wl better for the entire developer community.</p>
      </div>
    </div>
  );
};

export default PayMePage;
