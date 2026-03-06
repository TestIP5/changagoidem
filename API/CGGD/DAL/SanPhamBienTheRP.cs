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
    public class SanPhamBientheRP : ISanPhamBienTheRP
    {
        public void InsertSanPhamBienThe(SanPhamBienThe sanPham)
        {
            //string truyVan = "INSERT INTO SanPham(TenSanPham, MoTaSanPham, KichThuoc, MauSac, " +
            //      "ThuongHieu, HinhURL, DanhMucID, GiaBan, GiaNhap) " +
            //      "VALUES (@TenSanPham, @MoTaSanPham, @KichThuoc, @MauSac, " +
            //      "@ThuongHieu, @HinhURL, @DanhMucID, @GiaBan, @GiaNhap)";

            var truyVan = "sp_ThemSanPhamBienThe";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@masp", sanPham.MaSanPham);
                cmd.Parameters.AddWithValue("@kichthuoc", sanPham.KichThuoc);
                cmd.Parameters.AddWithValue("@mausac", sanPham.MauSac);
                cmd.Parameters.AddWithValue("@chatlieu", sanPham.ChatLieu);
                cmd.Parameters.AddWithValue("@doday", sanPham.DoDay);
                cmd.Parameters.AddWithValue("@loairuot", sanPham.LoaiRuot);
                cmd.Parameters.AddWithValue("@giaban", sanPham.Gia);
                cmd.Parameters.AddWithValue("@soluongton", sanPham.SoLuongTon);
                cmd.Parameters.AddWithValue("@anh_bienthe", sanPham.AnhBienThe);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException SqlEx)
                {
                    throw new Exception("Lỗi SQL khi thêm Sản Phẩm!" + SqlEx.Message);
                }
                catch (Exception Ex)
                {
                    throw new Exception("Lỗi khi thêm sản phẩm!" + Ex.Message);
                }
            }
        }
        public void UpdateSanPhamBienThe(SanPhamBienThe sanPham)
        {
            //var truyVan = "UPDATE SanPham SET TenSanPham = @TenSanPham, " +
            //       "MoTaSanPham = @MoTaSanPham, " +
            //       "KichThuoc = @KichThuoc, " +
            //       "MauSac = @MauSac, " +
            //       "ThuongHieu = @ThuongHieu, " +
            //       "HinhURL = @HinhURL, " +
            //       "GiaNhap = @GiaNhap, " +
            //       "GiaBan = @GiaBan " +
            //       "WHERE SanPhamID = @SanPhamID";
            var truyVan = "SuaSanPhamBienThe";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@mabienthe", sanPham.MaBienThe);
                cmd.Parameters.AddWithValue("@kichthuoc", sanPham.KichThuoc);
                cmd.Parameters.AddWithValue("@mausac", sanPham.MauSac);
                cmd.Parameters.AddWithValue("@chatlieu", sanPham.ChatLieu);
                cmd.Parameters.AddWithValue("@doday", sanPham.DoDay);
                cmd.Parameters.AddWithValue("@loairuot", sanPham.LoaiRuot);
                cmd.Parameters.AddWithValue("@giaban", sanPham.Gia);
                cmd.Parameters.AddWithValue("@soluongton", sanPham.SoLuongTon);
                cmd.Parameters.AddWithValue("@anh_bienthe", sanPham.AnhBienThe);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException SqlEx)
                {
                    throw new Exception("Lỗi SQL khi Update Sản Phẩm!" + SqlEx.Message);
                }
                catch (Exception Ex)
                {
                    throw new Exception("Lỗi khi Update sản phẩm!" + Ex.Message);
                }
            }
        }

     
        public void DeleteSanPhamBienThe(int sanPhamID)
        {
            var truyVan = "XoaSanPhamBienThe";
            using (var con = DbUlits.GetConnection())
            {
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@mabienthe", sanPhamID);
                try
                {
                    con.Open();
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException SqlEx)
                {
                    throw new Exception("Lỗi SQL khi Delete Sản Phẩm!" + SqlEx.Message);
                }
                catch (Exception Ex)
                {
                    throw new Exception("Lỗi khi Delete sản phẩm!" + Ex.Message);
                }
            }
        }


        //string truyVan = "SELECT SanPhamID, TenSanPham, MoTaSanPham, KichThuoc, MauSac, ThuongHieu, HinhURL, DanhMucID, GiaBan, GiaNhap " +
        //                 "FROM SanPham WHERE SanPhamID = @SanPhamID";

        public SanPhamBienThe GetSanPhamBienTheByID(int sanPhamID)
        {

            var truyVan = "LaySanPhamBienTheTheoMa";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.Parameters.AddWithValue("@mabienthe", sanPhamID);
                cmd.CommandType= CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows && reader.Read())
                        {
                            return new SanPhamBienThe
                            {
                                MaBienThe = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),

                                MaSanPham = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),

                                KichThuoc = reader.IsDBNull(2) ? null : reader.GetString(2),

                                MauSac = reader.IsDBNull(3) ? null : reader.GetString(3),

                                ChatLieu = reader.IsDBNull(4) ? null : reader.GetString(4),

                                DoDay = reader.IsDBNull(5) ? null : reader.GetString(5),

                                LoaiRuot = reader.IsDBNull(6) ? null : reader.GetString(6),

                                Gia = reader.IsDBNull(7) ? 0 : (float)reader.GetDouble(7),

                                SoLuongTon = reader.IsDBNull(8) ? 0 : reader.GetInt32(8),

                                AnhBienThe = reader.IsDBNull(9) ? null : reader.GetString(9),

                                Stt = reader.IsDBNull(10) ? 0 : reader.GetInt32(10)
                            };
                        }
                        else
                        {
                            throw new Exception("Không tìm thấy sản phẩm với ID: " + sanPhamID);
                        }
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

        public List<SanPhamBienThe> GetAll()
        {
            var truyVan = "LayTatCaSanPhamBienThe"; 

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<SanPhamBienThe>();

                        while (reader.Read())
                        {
                            var sanPham = new SanPhamBienThe
                            {
                                MaBienThe = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),

                                MaSanPham = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),

                                KichThuoc = reader.IsDBNull(2) ? null : reader.GetString(2),

                                MauSac = reader.IsDBNull(3) ? null : reader.GetString(3),

                                ChatLieu = reader.IsDBNull(4) ? null : reader.GetString(4),

                                DoDay = reader.IsDBNull(5) ? null : reader.GetString(5),

                                LoaiRuot = reader.IsDBNull(6) ? null : reader.GetString(6),

                                Gia = reader.IsDBNull(7) ? 0 : (float)reader.GetDouble(7),

                                SoLuongTon = reader.IsDBNull(8) ? 0 : reader.GetInt32(8),

                                AnhBienThe = reader.IsDBNull(9) ? null : reader.GetString(9),

                                Stt = reader.IsDBNull(10) ? 0 : reader.GetInt32(10)
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

    }
}
