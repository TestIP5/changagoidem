using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface ISanPhamBienTheRP
    {
        void InsertSanPhamBienThe(SanPhamBienThe sanPham);

        void UpdateSanPhamBienThe(SanPhamBienThe sanPham);

        void DeleteSanPhamBienThe(int sanPhamID);

        List<SanPhamBienThe> GetAll();

        SanPhamBienThe GetSanPhamBienTheByID(int sanPhamID);


    }
}
