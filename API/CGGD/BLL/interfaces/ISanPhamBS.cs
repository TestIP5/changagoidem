using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.interfaces
{
    public interface ISanPhamBS
    {
        void InsertSanPham(SanPhamAdd sanPham);

        void UpdateSanPham(SanPham sanPham);

        void DeleteSanPham(int sanPhamID);

        SanPham GetSanPhamByID(int sanPhamID);

        List<SanPham> GetAll();

        List<SanPham> GetSanPhamByIDDM(int danhMucID);
    }
}
