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
    public class NguoiDungRP : INguoiDungRP
    {

        public void DeleteNguoiDung(string nguoiDungID)
        {
            //string truyVan = "DELETE FROM NguoiDung WHERE NguoiDungID = @NguoiDungID";
            var truyVan = "XoaNguoiDung";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@taikhoan", nguoiDungID);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi xóa Người Dùng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi xóa Người Dùng: " + ex.Message);
                }
            }
        }

        public List<NguoiDung> GetAll()
        {
            var truyVan = "LayTatCaNguoiDung";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<NguoiDung>();

                        while (reader.Read())
                        {
                            var nguoiDung = new NguoiDung
                            {
                                TaiKhoan = reader.IsDBNull(0) ? string.Empty : reader.GetString(0),
                                MatKhau = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                Quyen = reader.IsDBNull(2) ? 0 : reader.GetInt32(2),
                                Stt = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
                            };

                            danhSachSanPham.Add(nguoiDung);
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

        public NguoiDung GetUserByID(string IDUser)
        {
            //string truyVan = "SELECT NguoiDungID, HoTen, Email, MatKhau, SoDienThoai, VaiTro " +
            //         "FROM NguoiDung WHERE NguoiDungID = @NguoiDungID";

            var truyVan = "LayNguoiDungTheoTaiKhoan";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con) 
                { 
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@taikhoan", IDUser);

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows && reader.Read())
                        {
                            return new NguoiDung
                            {
                                TaiKhoan = reader.IsDBNull(0) ? string.Empty : reader.GetString(0),
                                MatKhau = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                Quyen = reader.IsDBNull(2) ? 0 : reader.GetInt32(2),
                                Stt = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
                            };
                        }
                        else throw new Exception("Không tìm thấy người dùng với ID: " + IDUser);

                    }
                }
                catch (SqlException sqlEx) { throw new Exception("Lỗi SQL khi lấy thông tin Người Dùng: " + sqlEx.Message); }

                catch (Exception ex) { throw new Exception("Lỗi khi lấy thông tin Người Dùng: " + ex.Message); }
            }
        }

        public void InsertNguoiDung(NguoiDungDoi nguoiDung)
        {
            //string truyVan = "INSERT INTO NguoiDung(HoTen, Email, MatKhau, SoDienThoai, VaiTro) " +
            //                 "VALUES(@HoTen, @Email, @MatKhau, @SoDienThoai, @VaiTro)";

            var truyVan = "ThemNguoiDung";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con) 
                { 
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@taikhoan", nguoiDung.TaiKhoan);
                cmd.Parameters.AddWithValue("@matkhau", nguoiDung.MatKhau);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi thêm Người Dùng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi thêm Người Dùng: " + ex.Message);
                }
            }
        }

        public void UpdateNguoiDung(NguoiDungDoi nguoiDung)
        {
            //string truyVan = "UPDATE NguoiDung SET HoTen = @HoTen, Email = @Email, " +
            //                 "MatKhau = @MatKhau, SoDienThoai = @SoDienThoai, VaiTro = @VaiTro " +
            //                 "WHERE NguoiDungID = @NguoiDungID";

            var truyVan = "SuaNguoiDung";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@taikhoan", nguoiDung.TaiKhoan);
                cmd.Parameters.AddWithValue("@matkhau", nguoiDung.MatKhau);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi cập nhật Người Dùng: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi cập nhật Người Dùng: " + ex.Message);
                }
            }
        }
    }
}
