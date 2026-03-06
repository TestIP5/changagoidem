using BLL.interfaces;
using DAL;
using DAL.Interfaces;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class SanPhamBienTheBS : ISanPhamBienTheBS
    {
        private readonly ISanPhamBienTheRP _iSanPham;

        public SanPhamBienTheBS(ISanPhamBienTheRP iSanPham)
        {
            _iSanPham = iSanPham ?? throw new ArgumentNullException(nameof(iSanPham));
        }

        public void InsertSanPhamBienThe(SanPhamBienThe sanPham)
        {
            _iSanPham.InsertSanPhamBienThe(sanPham);
        }

        public void DeleteSanPhamBienThe(int sanPhamID)
        {
            _iSanPham.DeleteSanPhamBienThe(sanPhamID);
        }

        public void UpdateSanPhamBienThe(SanPhamBienThe sanPham)
        {
            _iSanPham.UpdateSanPhamBienThe(sanPham);
        }

        public SanPhamBienThe GetSanPhamBienTheByID(int sanPhamID)
        {
            return _iSanPham.GetSanPhamBienTheByID(sanPhamID);
        }

        public List<SanPhamBienThe> GetAll()
        {
            return _iSanPham.GetAll();
        }
    }
}
