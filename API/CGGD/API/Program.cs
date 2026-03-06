using BLL;
using BLL.interfaces;
using DAL;
using DAL.Interfaces;
using DTO;



var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddTransient<ISanPham, SanPhamRP>();
builder.Services.AddTransient<ISanPhamBS, SanPhamBS>();

builder.Services.AddTransient<INguoiDungRP, NguoiDungRP>();
builder.Services.AddTransient<INguoiDungBS, NguoiDungBS>();

builder.Services.AddTransient<IDonHangRP, DonHangRP>();
builder.Services.AddTransient<IDonHangBS, DonHangBS>();

builder.Services.AddTransient<IGioHangRP, GioHangRP>();
builder.Services.AddTransient<IGioHangBS, GioHangBS>();

builder.Services.AddTransient<IDanhMucRP, DanhMucRP>();
builder.Services.AddTransient<IDanhMucBS, DanhMucBS>();

builder.Services.AddTransient<ICTDonHangRP, CTDonHangRP>();
builder.Services.AddTransient<ICTDonHangBS, CTDonHangBS>();


builder.Services.AddTransient<IBinhLuanRP, BinhLuanRP>();
builder.Services.AddTransient<IBinhLuanBS, BinhLuanBS>();

builder.Services.AddTransient<ICTGioHangRP, CTGioHangRP>();
builder.Services.AddTransient<ICTGioHangBS, CTGioHangBS>();

builder.Services.AddTransient<ISanPhamBienTheRP, SanPhamBientheRP>();
builder.Services.AddTransient<ISanPhamBienTheBS, SanPhamBienTheBS>();

builder.Services.AddControllers();
https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
