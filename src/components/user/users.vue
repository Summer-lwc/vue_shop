<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table
            :data="userList"
            border
            stripe>
                <el-table-column 
                type="index">
                </el-table-column>
                <el-table-column 
                label="姓名"
                prop="username">
                </el-table-column>
                <el-table-column 
                label="邮箱"
                prop="email">
                </el-table-column>
                <el-table-column 
                label="电话"
                prop="mobile">
                </el-table-column>
                <el-table-column 
                label="角色"
                prop="role_name">
                </el-table-column>
                <el-table-column 
                label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column 
                label="操作"
                width="180">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="40%"
        @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>

        <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名" >
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        var checkEmail = (rule, value,cb) =>{
            const regEmail = /^\w+@\w+(\.\w+)+$/;
            if (regEmail.test(value)) {
            return cb();
            }
            //返回一个错误提示
            cb(new Error('请输入合法的邮箱'));
        };
        var checkMobile = (rule, value,cb) =>{
            const regMobile = /^1[34578]\d{9}$/;
            if (regMobile.test(value)) {
            return cb();
            }
            //返回一个错误提示
            cb(new Error('请输入合法的手机号码'));
        };
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 1
            },
            userList: [],
            total: 0,
            addDialogVisible: false,
            editDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '密码的长度在6~15个字符之间', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur'  }
                ]
            },
            editForm: {},
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur'  }
                ]
            }
        };
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo });
            if ( res.meta.status != 200 ){
                return this.$message.error("获取用户列表失败!");
            }
            this.userList = res.data.users;
            this.total = res.data.total;
            console.log(res);
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getUserList();
        },
        async userStateChanged(userInfo){
            const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
            if(res.meta.status != 200){
                userInfo.mg_state = !userInfo.mg_state;
                return this.$message.error("修改状态失败！");
            }
            this.$message.success("修改状态成功！");
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        addUser(){
            this.$refs.addFormRef.validate( async valid => {
                if( !valid ){
                    return;
                }
                const { data: res } = await this.$http.post("users", this.addForm);
                
                if( res.meta.status !== 201 ) {
                    return this.$message.error('添加用户失败！');
                }
                this.$message.success('添加用户成功！');
                this.addDialogClosed = false;
                this.getUserList();
            });
        },
        async showEditDialog(id) {
            console.log(id);
            const { data: res } = await this.$http.get('users/'+id);
            if( res.meta.status !== 200 ) {
                return this.$message.error('查询用户信息失败！');
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        editUserInfo(){
            this.$refs.editFormRef.validate( async valid => {
                if(!valid){
                    return;
                }
                const { data: res} = await this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                });
                if( res.meta.status !== 200 ) {
                    return this.$message.error("修改用户信息失败！");
                }
                this.editDialogVisible = false;
                this.getUserList();
                this.$message.success("修改用户信息成功！");
            });
        },
        async removeUserById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then( async () => {
                const { data: res} = await this.$http.delete('users/' + id);
                if(res.meta.status !== 200 ) {
                    return this.$message.error('删除用户失败！');
                }
                this.getUserList();
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
            console.log(id , confirmResult);
        }
    }
};
</script>

<style lang="less" scoped>
    
</style>