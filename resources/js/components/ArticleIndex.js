import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import SweetAlert from 'react-bootstrap-sweetalert';

class ArticleIndex extends Component {
    
    constructor () {
        super()
        this.state = {
            articles: [],
            msg: null,
            type: null,
            flash:false,
            alert: null,
        }
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    componentDidMount () {
        axios.get('/api/articles').then(response => {
            this.setState({
                articles: response.data
            })
        })  
    }

    confirmDelete(id){
        const getAlert = () => (
            <SweetAlert
                warning
                showCancel
                confirmBtnText="Hapus Deh"
                cancelBtnText="Nggak Jadi"
                confirmBtnBsStyle="default"
                cancelBtnBsStyle="danger"
                title="Tunggu ..."
                onConfirm={() => this.deleteItem(id)}
                onCancel={() => this.hideAlert()}
                focusCancelBtn
                >
                Kalau udah dihapus, nggak bakal balik lagi.
            </SweetAlert>
        );
        this.setState({
            alert: getAlert()
        });
    }

    deleteItem(id) {
        axios.delete(`/api/article/delete/${id}`).then(response => {
            var msg = response.data.success;
            if(msg == true){
                this.hideAlert();
                this.goToHome();
            }
        })
    }

    goToHome(){
        const getAlert = () => (
            <SweetAlert
                success
                title="Success!"
                onConfirm={() => this.onSuccess() }
                onCancel={this.hideAlert()}
                timeout={2000}
                confirmBtnText="Oke Siap"
                >
                Deleted article successfully
            </SweetAlert>
        );
        this.setState({
            alert: getAlert()
        });
    }

    onSuccess(){
        this.componentDidMount();
        this.hideAlert();
    }

    render () {
        const { articles } = this.state
        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-8'>
                <div className='card'>
                  <div className='card-header'>All Article</div>
                  <div className='card-body'>
                    <Link className='btn btn-primary btn-sm mb-3' to='/create'>
                      Create new article
                    </Link>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th width="50" className="text-center">No</th>
                                    <th>Title</th>
                                    <th width="200" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((article, i) => (
                                <tr key={i}>
                                    <td width="50" className="text-center">{i + 1}</td>
                                    <td>{article.title}</td>
                                    <td width="200" className="text-center">
                                        <div className="btn-group">
                                        <Link
                                            className='btn btn-primary'
                                            to={`/article/${article.id}`}
                                            >Detail
                                        </Link>
                                        <Link
                                            className='btn btn-success'
                                            to={`/article/edit/${article.id}`}
                                            >Edit
                                        </Link>
                                        <button
                                            className='btn btn-danger'
                                            onClick={() => this.confirmDelete(article.id)}
                                            >Delete
                                        </button>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        {this.state.alert}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default ArticleIndex