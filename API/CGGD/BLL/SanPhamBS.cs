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
    public class SanPhamBS : ISanPhamBS
    {
        private readonly ISanPham _iSanPham;

        public SanPhamBS(ISanPham iSanPham)
        {
            _iSanPham = iSanPham ?? throw new ArgumentNullException(nameof(iSanPham));
        }

        public void InsertSanPham(SanPhamAdd sanPham)
        {
            _iSanPham.InsertSanPham(sanPham);
        }

        public void DeleteSanPham(int sanPhamID)
        {
            _iSanPham.DeleteSanPham(sanPhamID);
        }

        public void UpdateSanPham(SanPham sanPham)
        {
            _iSanPham.UpdateSanPham(sanPham);
        }

        public SanPham GetSanPhamByID(int sanPhamID)
        {
            return _iSanPham.GetSanPhamByID(sanPhamID);
        }

        public List<SanPham> GetAll()
        {
            return _iSanPham.GetAll();
        }

        public List<SanPham> GetSanPhamByIDDM(int danhMucID)
        {
            return _iSanPham.GetSanPhamByIDDM(danhMucID);
        }
    }
}
