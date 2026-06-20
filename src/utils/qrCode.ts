import QRCode from 'qrcode';

export interface QRData {
  enrollment_no: string;
  email: string;
  uid: string;
  registered_events: string[];
  payment_status: string;
  timestamp: string;
}

export const generateQRCode = async (data: QRData): Promise<string> => {
  try {
    const qrDataString = JSON.stringify(data);
    const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const validateQRCode = (qrData: string): QRData | null => {
  try {
    const parsedData = JSON.parse(qrData);
    
    // Validate required fields
    if (!parsedData.enrollment_no || !parsedData.email || !parsedData.uid) {
      return null;
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error validating QR code:', error);
    return null;
  }
};

export const downloadQRCode = (dataURL: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};