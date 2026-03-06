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
    public class GioHangRP : IGioHangRP
    {
        public void DeleteGioHang(int gioHangID)
        {
            //var truyVan = "DELETE FROM GioHang WHERE GioHangID = @GioHangID";

            var truyVan = "XoaGioHang";
            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@magh", gioHangID);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi xóa Giỏ Hàng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi xóa Giỏ Hàng: " + ex.Message);
                }
            }
        }

        public List<GioHang> GetAll()
        {
            var truyVan = "LayTatCaGioHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<GioHang>();

                        while (reader.Read())
                        {
                            var nguoiDung = new GioHang();
                            {
                                nguoiDung.MaGioHang = reader.GetInt32(0);
                                nguoiDung.TaiKhoan = reader.IsDBNull(1) ? string.Empty : reader.GetString(1);
                                nguoiDung.Stt = reader.GetInt32(2);
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

        public GioHang GetGioHangByID(int gioHangID)
        {
            //string truyVan = "SELECT GioHangID, NgayTao, SanPhamID, SoLuong, Gia, ThuongHieu " +
            //                 "FROM GioHang WHERE GioHangID = @GioHangID";

            var truyVan = "LayGioHangTheoMa";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@magh", gioHangID);

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows && reader.Read())
                        {
                            return new GioHang
                            {
                                MaGioHang = reader.GetInt32(0),
                                TaiKhoan = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                Stt = reader.GetInt32(2),
                            };
                        }
                        else
                        {
                            throw new Exception("Không tìm thấy giỏ hàng với ID: " + gioHangID);
                        }
                    }
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi lấy thông tin Giỏ Hàng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi lấy thông tin Giỏ Hàng: " + ex.Message);
                }
            }
        }


        public void InsertGioHang(GioHang gioHang)
        {
            //string truyVan = "INSERT INTO GioHang(SanPhamID, SoLuong, Gia, ThuongHieu, NgayTao) " +
            //         "VALUES(@SanPhamID, @SoLuong, @Gia, @ThuongHieu, @NgayTao)";

            var truyVan = "ThemGioHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con) 
                { 
                    CommandType = CommandType.StoredProcedure 
                };
                cmd.Parameters.AddWithValue("@taikhoan", gioHang.TaiKhoan);
                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi thêm Giỏ Hàng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi thêm Giỏ Hàng: " + ex.Message);
                }
            }
        }
    

        public void UpdateGioHang(GioHang gioHang)
        {
            //var truyVan = "UPDATE GioHang SET SanPhamID = @SanPhamID, " +
            //            "SoLuong = @SoLuong, " +
            //            "Gia = @Gia, " +
            //            "ThuongHieu = @ThuongHieu, " +
            //            "NgayTao = @NgayTao " +
            //            "WHERE GioHangID = @GioHangID";

            var truyVan = "SuaGioHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();

                var cmd = new SqlCommand(truyVan, con);
                cmd.Parameters.AddWithValue("@MaGH", gioHang.MaGioHang);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi cập nhật Giỏ Hàng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi cập nhật Giỏ Hàng: " + ex.Message);
                }
            }
        }
    }
}
