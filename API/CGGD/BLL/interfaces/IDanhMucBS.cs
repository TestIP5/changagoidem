using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.interfaces
{
    public interface IDanhMucBS
    {
        void InsertDanhMuc(DanhMuc danhMuc);

        void UpdateDanhMuc(DanhMuc danhMuc);

        void DeleteDanhMuc(int danhMucID);

        List<DanhMuc> GetAll();
        DanhMuc GetDanhMucByID(int danhMucID);
    }
}
