# 灌云吉狮汽车饰品有限公司官网

品牌展示型官网，主营汽车脚垫、手缝方向盘套。

## 技术栈

- **框架**：Next.js 14 App Router + TypeScript
- **样式**：Tailwind CSS + framer-motion
- **数据**：Prisma ORM + SQLite（单文件数据库）
- **认证**：JWT (jose) + bcryptjs
- **图片**：sharp 自动转 WebP + 后台上传管理
- **部署**：Docker Compose + Nginx + Cloudflare Tunnel

## 目录结构

```
src/
├── app/
│   ├── (site)/          # 公开前台
│   │   ├── page.tsx           # 首页
│   │   ├── about/             # 关于我们
│   │   ├── products/          # 产品中心
│   │   ├── cases/             # 案例展示
│   │   ├── craft/             # 工艺优势
│   │   └── contact/           # 联系我们
│   ├── admin/           # 后台管理
│   │   ├── login/
│   │   ├── products/
│   │   ├── cases/
│   │   ├── hero/
│   │   ├── gallery/
│   │   ├── categories/
│   │   ├── settings/
│   │   ├── users/
│   │   └── account/
│   └── api/             # API 路由
├── components/          # 通用组件
├── lib/                 # 工具库（prisma/auth/utils）
└── middleware.ts        # 路由保护
prisma/
├── schema.prisma        # 数据模型
└── seed.ts              # 初始数据
```

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库
npm run db:push
npm run db:seed

# 3. 启动开发服务器
npm run dev
# → http://localhost:3000        前台
# → http://localhost:3000/admin  后台
```

**默认账号**（首次登录后请立即改密码）：

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 超级管理员 | `admin@ji-shi.com` | `admin123` |
| 脚垫负责人（黄威） | `huangwei@ji-shi.com` | `huangwei123` |
| 方向盘套负责人（朱苏婷） | `zhusuting@ji-shi.com` | `zhusuting123` |

## 服务器部署（Docker + Cloudflare Tunnel）

### 1. 服务器准备

```bash
# 假设服务器已经装好 docker 和 docker-compose
cd /root
git clone https://github.com/zhutianci/jishi.git
cd jishi
```

### 2. 配置 Cloudflare Tunnel

1. 登录 Cloudflare → Zero Trust → Networks → Tunnels
2. 点击 **Create a tunnel**，选择 Cloudflared
3. 起名（如 `jishi-tunnel`），保存
4. 选择 **Docker** 标签页，复制 `--token` 后面那串 token
5. 配置 **Public Hostnames**：
   - Subdomain: 空 / `www`
   - Domain: `ji-shi.com`
   - Service: HTTP, `nginx:80`
6. **先到 Cloudflare DNS 中删掉 ji-shi.com 的旧 A/CNAME 记录**，避免冲突

### 3. 写入 .env

```bash
cp .env.example .env
nano .env
```

填写：

```env
DATABASE_URL=file:/app/data/jishi.db
JWT_SECRET=<openssl rand -base64 32 的输出>
NEXT_PUBLIC_APP_URL=https://ji-shi.com
APP_URL=https://ji-shi.com
CLOUDFLARE_TUNNEL_TOKEN=<上一步复制的 token>
```

### 4. 启动

```bash
docker compose up -d --build
```

第一次启动后初始化数据库（创建表 + 写入默认账号/分类/设置）：

```bash
# 1. 推送 schema 到 SQLite（创建所有表）
docker compose exec app npx prisma db push --skip-generate

# 2. 写入默认账号、分类、初始设置
docker compose exec app node prisma/seed.mjs
```

执行完成后，会看到默认账号信息输出。**立即用 admin 账号登录后台修改所有人的默认密码**。

### 5. 验证

- 访问 `https://ji-shi.com` 看到首页
- 访问 `https://ji-shi.com/admin/login` 登录后台
- 用 admin 账号登录，立即改密码
- 上传 Hero 背景图、公司 Logo、负责人微信二维码
- 编辑公司信息、添加产品和案例

### IP 直接访问（备用通道）

服务器开放 `81` 端口（避开 beiguo 的 `80`），可直接：

```
http://<服务器IP>:81/
```

⚠️ IP 访问只能浏览，登录后台必须用域名（HTTPS Cookie 限制）。

## 后台功能

### 角色权限

- **超级管理员（ADMIN）**：所有权限，唯一能管理"账号、站点设置、Hero、相册、分类"的角色
- **脚垫负责人（FLOORMAT_MGR）**：只能管理脚垫分类的产品和案例
- **方向盘套负责人（WHEELCOVER_MGR）**：只能管理方向盘套分类的产品和案例

### 可管理的内容

| 模块 | 路径 | 谁能管 |
|------|------|--------|
| 仪表盘 | `/admin` | 全部角色（数据按权限过滤） |
| 产品管理 | `/admin/products` | 全部角色（数据按权限过滤） |
| 案例管理 | `/admin/cases` | 全部角色（数据按权限过滤） |
| 首页轮播 | `/admin/hero` | 仅超管 |
| 相册管理 | `/admin/gallery` | 仅超管 |
| 分类设置 | `/admin/categories` | 仅超管 |
| 站点设置 | `/admin/settings` | 仅超管 |
| 账号管理 | `/admin/users` | 仅超管 |
| 修改自己密码 | `/admin/account` | 全部角色 |

### 图片管理

所有图片（产品图、案例图、Hero、二维码、工厂图、资质）都通过后台上传。
- 自动转 WebP 格式，质量 85
- 自动 EXIF 旋转
- 最大宽度 2400px（高清屏友好）
- 单张最大 15MB
- 存储到 `/app/public/uploads/`（docker volume 持久化）

## 数据备份

```bash
# 备份数据库
docker compose exec app cp /app/data/jishi.db /app/data/jishi.db.backup-$(date +%F)

# 完整备份（数据库 + 上传图片）
docker run --rm -v jishi_data:/data -v jishi_uploads:/uploads -v $(pwd):/backup alpine \
  tar czf /backup/jishi-backup-$(date +%F).tar.gz /data /uploads
```

## 更新部署

```bash
git pull
docker compose up -d --build
# 如果 prisma/schema.prisma 改了：
docker compose exec app npx prisma db push --skip-generate
```

## 与 beiguo 项目共存

| 项目 | 域名 | IP 端口 | 容器前缀 | Docker 网络 |
|------|------|---------|----------|-------------|
| beiguo | bigolab.com | `:80` | beiguo-* | app-network |
| jishi | ji-shi.com | `:81` | jishi-* | jishi-net |

两个项目完全独立，互不影响。
