import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Hoặc dùng instance axios của bạn

const UserList = () => {
    const [customers, setCustomers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, [page]); // Chạy lại mỗi khi page thay đổi

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // Gọi đến API [HttpGet] trong UserController của bạn
            const response = await axios.get(`/api/user?page=${page}&pageSize=${pageSize}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            // Theo code C# của bạn: response.data sẽ có { Total, Data, Page, PageSize }
            setCustomers(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            alert("Lỗi khi tải danh sách:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
            
            {/* Table hiển thị */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {customers.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4">{user.fullName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.phoneNumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang (Pagination) */}
            <div className="mt-4 flex justify-between items-center">
                <span>Tổng số: {total}</span>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2">Trang {page} / {Math.ceil(total / pageSize)}</span>
                    <button 
                        disabled={page >= Math.ceil(total / pageSize)}
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserList;