using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IDanhMucRP
    {
        void InsertDanhMuc(DanhMuc danhMuc);

        void UpdateDanhMuc(DanhMuc danhMuc);

        void DeleteDanhMuc(int danhMucID);

        DanhMuc GetDanhMucByID(int danhMucID);

        List<DanhMuc> GetAll();
    }
}
