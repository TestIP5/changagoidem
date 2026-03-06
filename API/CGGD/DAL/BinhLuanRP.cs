using DAL.Interfaces;
using DTO;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class BinhLuanRP : IBinhLuanRP
    {
        public void InsertComment(BinhLuan comment)
        {
            var truyVan = "ThemBinhLuan";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@masp", comment.MaSanPham);
                cmd.Parameters.AddWithValue("@taikhoan", comment.TaiKhoan);
                cmd.Parameters.AddWithValue("@noidung", comment.NoiDung);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi thêm Comment!" + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi thêm Comment!" + ex.Message);
                }
            }
        }

        public void UpdateComment(BinhLuan comment)
        {
            var truyVan = "SuaBinhLuan";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@MaSP", comment.MaSanPham);
                cmd.Parameters.AddWithValue("@TaiKhoan", comment.TaiKhoan);
                cmd.Parameters.AddWithValue("@NoiDung", comment.NoiDung);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi cập nhật Comment!" + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi cập nhật Comment!" + ex.Message);
                }
            }
        }

        public void DeleteComment(int commentID)
        {
            var truyVan = "XoaBinhLuan";

            using (var con = DbUlits.GetConnection())
            {
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@MaBL", commentID);

                try
                {
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi xóa Comment!" + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi xóa Comment!" + ex.Message);
                }
            }
        }

        public List<BinhLuan> GetCommentByID(int commentID)
        {
            var truyVan = "LayBinhLuanTheoSanPham"; 

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@masp", commentID);

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<BinhLuan>();

                        while (reader.Read())
                        {
                            var nguoiDung = new BinhLuan();
                            {
                                nguoiDung.MaBinhLuan = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                                nguoiDung.MaSanPham = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
                                nguoiDung.TaiKhoan = reader.IsDBNull(2) ? string.Empty : reader.GetString(2);
                                nguoiDung.NoiDung = reader.IsDBNull(3) ? string.Empty : reader.GetString(3);
                            };

                            danhSachSanPham.Add(nguoiDung);
                        }

                        return danhSachSanPham;
                    }
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi lấy thông tin Comment: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi lấy thông tin Comment: " + ex.Message);
                }
            }
        }

        public List<BinhLuan> GetAll()
        {
            var truyVan = "LayBinhLuan";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<BinhLuan>();

                        while (reader.Read())
                        {
                            var nguoiDung = new BinhLuan();
                            {
                                nguoiDung.MaBinhLuan = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                                nguoiDung.MaSanPham = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
                                nguoiDung.TaiKhoan = reader.IsDBNull(2) ? string.Empty : reader.GetString(2);
                                nguoiDung.NoiDung = reader.IsDBNull(3) ? string.Empty : reader.GetString(3);
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
    }
}
