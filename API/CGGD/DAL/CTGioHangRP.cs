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
    public class CTGioHangRP : ICTGioHangRP
    {
        public void InsertComment(ChiTietGioHang1 comment)
        {
            var truyVan = "ThemChiTietGioHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@magh", comment.MaGioHang);
                cmd.Parameters.AddWithValue("@masp", comment.MaSanPham);


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

        public void UpdateCommentI(ChiTietGioHang1 comment)
        {
            var truyVan = "TangChiTietGioHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@magh", comment.MaGioHang);
                cmd.Parameters.AddWithValue("@masp", comment.MaSanPham);

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

        public void UpdateCommentD(ChiTietGioHang1 comment)
        {
            var truyVan = "GiamChiTietGioHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@magh", comment.MaGioHang);
                cmd.Parameters.AddWithValue("@masp", comment.MaSanPham);

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

        public void DeleteComment(int commentID,int commentID2)
        {
            var truyVan = "XoaChiTietGioHang";

            using (var con = DbUlits.GetConnection())
            {
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@magh", commentID);
                cmd.Parameters.AddWithValue("@masp", commentID2);

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

      

        public List<ChiTietGioHang> GetAll()
        {
            var truyVan = "LayTatCaChiTietGioHang";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<ChiTietGioHang>();

                        while (reader.Read())
                        {
                            var nguoiDung = new ChiTietGioHang();
                            {
                                nguoiDung.MaGioHang = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
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
    }
}
