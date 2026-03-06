using DAL.Interfaces;
using DTO;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace DAL
{
    public class CTDonHangRP : ICTDonHangRP
    {
        public void DeleteChiTietHoaDon(int madh,int masp)
        {
            //var truyVan = "DELETE FROM ChiTietHoaDon WHERE ChiTietHoaDonID = @ChiTietHoaDonID";
            var truyVan = "XoaCTDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@madh", madh);
                cmd.Parameters.AddWithValue("@madh", masp);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi xóa Chi Tiết Hóa Đơn: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi xóa chi tiết hóa đơn: " + ex.Message);
                }
            }
        }


        public List<ChiTietDonHang> GetAll()
        {
            var truyVan = "LayCTDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<ChiTietDonHang>();

                        while (reader.Read())
                        {
                            var nguoiDung = new ChiTietDonHang();
                            {
                                nguoiDung.MaDonHang = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
                                nguoiDung.MaSanPham = reader.IsDBNull(2) ? 0 : reader.GetInt32(2);
                                nguoiDung.SoLuong = reader.IsDBNull(3) ? 0 : reader.GetInt32(3);
                                nguoiDung.Stt = reader.IsDBNull(1) ? 0 : reader.GetInt32(4);
                            };

                            danhSachSanPham.Add(nguoiDung);
                        }

                        return danhSachSanPham;
                    }
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi lấy thông tin giỏ hàng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi lấy thông tin giỏ hàng: " + ex.Message);
                }
            }
        }

        public List<ChiTietDonHang> GetAllSP()
        {
            var truyVan = "LayCTDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<ChiTietDonHang>();

                        while (reader.Read())
                        {
                            var nguoiDung = new ChiTietDonHang();
                            {
                                nguoiDung.MaDonHang = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                                nguoiDung.MaSanPham = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
                                nguoiDung.SoLuong = reader.IsDBNull(2) ? 0 : reader.GetInt32(2);
                                nguoiDung.Stt = reader.IsDBNull(3) ? 0 : reader.GetInt32(3);

                            };

                            danhSachSanPham.Add(nguoiDung);
                        }

                        return danhSachSanPham;
                    }
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi lấy thông tin giỏ hàng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi lấy thông tin giỏ hàng: " + ex.Message);
                }
            }
        }

        public List<ChiTietDonHang> GetChiTietHDByID(int ctHoaDonID)
        {
            //string truyVan = "SELECT ChiTietHoaDonID, HoaDonID, SanPhamID, SoLuong, TongTien " +
            //                 "FROM ChiTietHoaDon WHERE ChiTietHoaDonID = @ChiTietHoaDonID";

            var truyVan = "LayChiTietDonHangTheoMaDH";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@madh", ctHoaDonID);

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<ChiTietDonHang>();

                        while (reader.Read())
                        {
                            var sanPham = new ChiTietDonHang
                            {
                                MaDonHang = reader.GetInt32(0),
                                MaSanPham = reader.GetInt32(1),
                                SoLuong = reader.IsDBNull(2) ? 0 : reader.GetInt32(3),
                                Stt = reader.GetInt32(3),
                            };

                            danhSachSanPham.Add(sanPham);
                        }

                        return danhSachSanPham;
                    }
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi lấy thông tin Sản Phẩm: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi lấy thông tin Sản Phẩm: " + ex.Message);
                }
            }
        }


        public void InsertChiTietHoaDon(ChiTietDonHang chiTietHD)
        {
            //string truyVan = "INSERT INTO ChiTietHoaDon(HoaDonID, SanPhamID, SoLuong, TongTien) " +
            //             "VALUES(@HoaDonID, @SanPhamID, @SoLuong, @TongTien)";

            var truyVan = "ThemChiTietDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@madh", chiTietHD.MaDonHang);
                cmd.Parameters.AddWithValue("@masp", chiTietHD.MaSanPham);
                cmd.Parameters.AddWithValue("@soluong", chiTietHD.SoLuong);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi thêm Chi Tiết Hóa Đơn: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi thêm chi tiết hóa đơn: " + ex.Message);
                }
            }
        }


        public void UpdateChiTietHoaDon(ChiTietDonHang chiTietHD)
        {
            //var truyVan = "UPDATE ChiTietHoaDon SET HoaDonID = @HoaDonID, " +
            //           "SanPhamID = @SanPhamID, " +
            //           "SoLuong = @SoLuong, " +
            //           "TongTien = @TongTien " +
            //           "WHERE ChiTietHoaDonID = @ChiTietHoaDonID";

            var truyVan = "SuaCTDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                var cmd = new SqlCommand(truyVan, con) 
                { 
                    CommandType = CommandType.StoredProcedure 
                };

                cmd.Parameters.AddWithValue("@madh", chiTietHD.MaDonHang);
                cmd.Parameters.AddWithValue("@masp", chiTietHD.MaSanPham);
                cmd.Parameters.AddWithValue("@soluong", chiTietHD.SoLuong);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi cập nhật Chi Tiết Hóa Đơn: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi cập nhật chi tiết hóa đơn: " + ex.Message);
                }
            }
        }
    }
}
