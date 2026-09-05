import React from 'react';

export const Loading = ({ text = 'Đang tải dữ liệu...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">{text}</p>
    </div>
  );
};

export default Loading;

