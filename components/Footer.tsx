import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Java Interview. Phát triển bởi Nguyền Huy Điền - Lập trình viên Freelancer.</p>
      </div>
    </footer>
  );
};

export default Footer;