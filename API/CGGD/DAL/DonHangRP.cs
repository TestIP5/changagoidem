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
    public class DonHangRP : IDonHangRP
    {
        public void DeleteHoaDon(int hoaDonID)
        {
            //var truyVan = "DELETE FROM HoaDon WHERE HoaDonID = @HoaDonID";
            var truyVan = "XoaDonHang";
            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@madh", hoaDonID);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi xóa Hóa Đơn: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi xóa Hóa Đơn: " + ex.Message);
                }
            }
        }

        public List<DonHang> GetAll()
        {
            var truyVan = "LayTatCaDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<DonHang>();

                        while (reader.Read())
                        {
                            var nguoiDung = new DonHang();
                            {
                                nguoiDung.MaDonHang = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                                nguoiDung.TaiKhoan = reader.IsDBNull(1) ? string.Empty : reader.GetString(1);
                                nguoiDung.DiaChi = reader.IsDBNull(2) ? string.Empty : reader.GetString(2);
                                nguoiDung.NgayDat = reader.IsDBNull(3) ? DateTime.MinValue : reader.GetDateTime(3);
                                nguoiDung.TrangThai = reader.IsDBNull(4) ? string.Empty : reader.GetString(4);
                                nguoiDung.Stt = reader.IsDBNull(5) ? 0 : reader.GetInt32(5);
                                nguoiDung.SoDienThoai = reader.IsDBNull(6) ? string.Empty : reader.GetString(6);
                                nguoiDung.HoTen = reader.IsDBNull(7) ? string.Empty : reader.GetString(7);
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

        public DonHang GetHoaDonByID(int hoaDonID)
        {
            //string truyVan = "SELECT HoaDonID, NguoiDungID, NgayDatHang, TongTien, TrangThai " +
            //                 "FROM HoaDon WHERE HoaDonID = @HoaDonID";

            var truyVan = "LayDonHangTheoMa";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@MaDH", hoaDonID);

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows && reader.Read())
                        {
                            return new DonHang
                            {
                                MaDonHang = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                                TaiKhoan = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                DiaChi = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                                NgayDat = reader.IsDBNull(3) ? DateTime.MinValue : reader.GetDateTime(3),
                                TrangThai = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                                SoDienThoai = reader.IsDBNull(5) ? string.Empty : reader.GetString(5),
                                HoTen = reader.IsDBNull(6) ? string.Empty : reader.GetString(6),
                                Stt = reader.IsDBNull(7) ? 0 : reader.GetInt32(7),

                            };
                        }
                        else
                        {
                            throw new Exception("Không tìm thấy hóa đơn với ID: " + hoaDonID);
                        }
                    }
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi lấy thông tin Hóa Đơn: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi lấy thông tin Hóa Đơn: " + ex.Message);
                }
            }
        }


        public int InsertHoaDon(DonHang hoaDon)
        {
            //string truyVan = "INSERT INTO HoaDon(NguoiDungID, NgayDatHang, TongTien, TrangThai) " +
            //             "VALUES(@NguoiDungID, @NgayDatHang, @TongTien, @TrangThai)";

            var truyVan = "ThemDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@taikhoan", hoaDon.TaiKhoan);
                cmd.Parameters.AddWithValue("@ngaydat", hoaDon.NgayDat);
                cmd.Parameters.AddWithValue("@diachi", hoaDon.DiaChi);
                cmd.Parameters.AddWithValue("@sdt", hoaDon.SoDienThoai);
                cmd.Parameters.AddWithValue("@hoten", hoaDon.HoTen);

                try
                {
                    var maDonHang = cmd.ExecuteScalar(); // Lấy mã đơn hàng vừa tạo
                    return Convert.ToInt32(maDonHang);
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi thêm Hóa Đơn: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi thêm Hóa Đơn: " + ex.Message);
                }
            }
        }

        public void UpdateHoaDon(TTDonHang hoaDon)
        {
            //var truyVan = "UPDATE HoaDon SET NguoiDungID = @NguoiDungID, " +
            //           "NgayDatHang = @NgayDatHang, " +
            //           "TongTien = @TongTien, " +
            //           "TrangThai = @TrangThai " +
            //           "WHERE HoaDonID = @HoaDonID";

            var truyVan = "SuaTrangThaiDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                SqlCommand cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@madh", hoaDon.MaDonHang);
                cmd.Parameters.AddWithValue("@trangthai", hoaDon.TrangThai);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi cập nhật Hóa Đơn: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi cập nhật Hóa Đơn: " + ex.Message);
                }
            }
        }

        public void UpdateTTHoaDon(TTDonHang2 hoaDon)
        {
            //var truyVan = "UPDATE HoaDon SET NguoiDungID = @NguoiDungID, " +
            //           "NgayDatHang = @NgayDatHang, " +
            //           "TongTien = @TongTien, " +
            //           "TrangThai = @TrangThai " +
            //           "WHERE HoaDonID = @HoaDonID";

            var truyVan = "SuaThongTinDonHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                SqlCommand cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@madh", hoaDon.MaDonHang);
                cmd.Parameters.AddWithValue("@diachi", hoaDon.DiaChi);
                cmd.Parameters.AddWithValue("@sdt", hoaDon.SoDienThoai);
                cmd.Parameters.AddWithValue("@hoten", hoaDon.HoTen);


                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi cập nhật Hóa Đơn: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi cập nhật Hóa Đơn: " + ex.Message);
                }
            }
        }
    }
}
