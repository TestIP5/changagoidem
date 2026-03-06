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
    public class SanPhamRP : ISanPham
    {
        public void InsertSanPham(SanPhamAdd sanPham)
        {
            //string truyVan = "INSERT INTO SanPham(TenSanPham, MoTaSanPham, KichThuoc, MauSac, " +
            //      "ThuongHieu, HinhURL, DanhMucID, GiaBan, GiaNhap) " +
            //      "VALUES (@TenSanPham, @MoTaSanPham, @KichThuoc, @MauSac, " +
            //      "@ThuongHieu, @HinhURL, @DanhMucID, @GiaBan, @GiaNhap)";

            var truyVan = "ThemSanPham";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@madm", sanPham.MaDanhMuc);
                cmd.Parameters.AddWithValue("@tensp", sanPham.TenSanPham);
                cmd.Parameters.AddWithValue("@gia", sanPham.Gia);
                cmd.Parameters.AddWithValue("@mota", sanPham.MoTa);
                cmd.Parameters.AddWithValue("@anh", sanPham.Anh);

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
        public void UpdateSanPham(SanPham sanPham)
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
            var truyVan = "SuaSanPham";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                SqlCommand cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@masp", sanPham.MaSanPham);
                cmd.Parameters.AddWithValue("@madm", sanPham.MaDanhMuc);
                cmd.Parameters.AddWithValue("@tensp", sanPham.TenSanPham);
                cmd.Parameters.AddWithValue("@gia", sanPham.Gia);
                cmd.Parameters.AddWithValue("@mota", sanPham.MoTa);
                cmd.Parameters.AddWithValue("@anh", sanPham.Anh);

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

     
        public void DeleteSanPham(int sanPhamID)
        {
            var truyVan = "XoaSanPham";
            using (var con = DbUlits.GetConnection())
            {
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@masp", sanPhamID);
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

        public SanPham GetSanPhamByID(int sanPhamID)
        {

            var truyVan = "LaySanPhamTheoMa";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.Parameters.AddWithValue("@masp", sanPhamID);
                cmd.CommandType= CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows && reader.Read())
                        {
                            return new SanPham
                            {
                                MaSanPham = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                                MaDanhMuc = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                                TenSanPham = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                                Gia = reader.IsDBNull(3) ? 0 : (float)reader.GetDouble(3),
                                MoTa = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                                Stt = reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
                                Anh = reader.IsDBNull(6) ? string.Empty : reader.GetString(6),
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

        public List<SanPham> GetAll()
        {
            var truyVan = "LayTatCaSanPham"; 

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<SanPham>();

                        while (reader.Read())
                        {
                            var sanPham = new SanPham
                            {
                                MaSanPham = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                                MaDanhMuc = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                                TenSanPham = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                                Gia = reader.IsDBNull(3) ? 0 : (float)reader.GetDouble(3),
                                MoTa = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                                Stt = reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
                                Anh = reader.IsDBNull(6) ? string.Empty : reader.GetString(6)
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

        public List<SanPham> GetSanPhamByIDDM(int danhMucID)
        {

            var truyVan = "LaySanPhamDanhMuc";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.Parameters.AddWithValue("@MaDanhMuc", danhMucID);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<SanPham>();

                        while (reader.Read())
                        {
                            var sanPham = new SanPham
                            {
                                MaSanPham = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                                MaDanhMuc = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                                TenSanPham = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                                Gia = reader.IsDBNull(3) ? 0 : (float)reader.GetDouble(3),
                                MoTa = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                                Stt = reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
                                Anh = reader.IsDBNull(6) ? string.Empty : reader.GetString(6),
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
