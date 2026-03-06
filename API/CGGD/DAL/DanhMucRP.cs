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
    public class DanhMucRP : IDanhMucRP
    {
        public void DeleteDanhMuc(int danhMucID)
        {
            //var truyVan = "DELETE FROM DanhMuc WHERE DanhMucID = @DanhMucID";

            var truyVan = "XoaDanhMuc";
            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@madm", danhMucID);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi xóa Danh Mục: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi xóa Danh Mục: " + ex.Message);
                }
            }
        }

        public List<DanhMuc> GetAll()
        {
            var truyVan = "LayTatCaDanhMuc";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        var danhSachSanPham = new List<DanhMuc>();

                        while (reader.Read())
                        {
                            var danhMuc = new DanhMuc();
                            {
                                danhMuc.MaDanhMuc = reader.GetInt32(0);
                                danhMuc.TenDanhMuc = reader.IsDBNull(1) ? string.Empty : reader.GetString(1);
                                danhMuc.Stt = reader.GetInt32(2);
                            };

                            danhSachSanPham.Add(danhMuc);
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

        public DanhMuc GetDanhMucByID(int danhMucID)
        {
            //string truyVan = "SELECT DanhMucID, TenDanhMuc " +
            //                 "FROM DanhMuc WHERE DanhMucID = @DanhMucID";

            var truyVan = "LaySanPhamDanhMuc";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con) 
                { 
                    CommandType = CommandType.StoredProcedure 
                };
                cmd.Parameters.AddWithValue("@madm", danhMucID);

                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.HasRows && reader.Read())
                        {
                            return new DanhMuc
                            {
                                MaDanhMuc = reader.GetInt32(0),
                                TenDanhMuc = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                Stt = reader.GetInt32(2),
                            };
                        }
                        else
                        {
                            throw new Exception("Không tìm thấy danh mục với ID: " + danhMucID);
                        }
                    }
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi lấy thông tin Danh Mục: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi lấy thông tin Danh Mục: " + ex.Message);
                }
            }
        }


        public void InsertDanhMuc(DanhMuc danhMuc)
        {
            //string truyVan = "INSERT INTO DanhMuc(TenDanhMuc) VALUES(@TenDanhMuc)";

            var truyVan = "ThemDanhMuc";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con) 
                { 
                    CommandType = CommandType.StoredProcedure 
                };
                cmd.Parameters.AddWithValue("@tendm", danhMuc.TenDanhMuc);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi thêm Danh Mục: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi thêm Danh Mục: " + ex.Message);
                }
            }
        }

       
        public void UpdateDanhMuc(DanhMuc danhMuc)
        {
            //var truyVan = "UPDATE DanhMuc SET TenDanhMuc = @TenDanhMuc WHERE DanhMucID = @DanhMucID";

            var truyVan = "SuaDanhmMuc";

            using (var con = DbUlits.GetConnection())
            {
                con.Open();
                var cmd = new SqlCommand(truyVan, con) 
                { 
                    CommandType = CommandType.StoredProcedure 
                };
                cmd.Parameters.AddWithValue("@tendm", danhMuc.TenDanhMuc);
                cmd.Parameters.AddWithValue("@madm", danhMuc.MaDanhMuc);

                try
                {
                    cmd.ExecuteNonQuery();
                }
                catch (SqlException sqlEx)
                {
                    throw new Exception("Lỗi SQL khi cập nhật Danh Mục: " + sqlEx.Message);
                }
                catch (Exception ex)
                {
                    throw new Exception("Lỗi khi cập nhật Danh Mục: " + ex.Message);
                }
            }
        }
    }
}
