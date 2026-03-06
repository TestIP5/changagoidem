using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface ISanPham
    {
        void InsertSanPham(SanPhamAdd sanPham);

        void UpdateSanPham(SanPham sanPham);

        void DeleteSanPham(int sanPhamID);

        List<SanPham> GetAll();

        SanPham GetSanPhamByID(int sanPhamID);

        List<SanPham> GetSanPhamByIDDM(int danhMucID);

    }
}
