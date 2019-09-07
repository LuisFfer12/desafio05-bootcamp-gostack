import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';
import { Loading, Owner, IssueList, FilterList, Pagination } from './styles';
import Container from '../../components/Container/index';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    page: 1,
    issueState: 'all',
  };

  async componentDidMount() {
    const { issueState } = this.state;
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      await api.get(`/repos/${repoName}`),
      await api.get(`/repos/${repoName}/issues`, {
        params: {
          state: issueState,
          per_page: 10,
          page: 1,
        },
      }),
    ]);

    this.setState({
      loading: false,
      repository: repository.data,
      issues: issues.data,
    });
  }

  async componentDidUpdate(_, prevState) {
    const { page, issueState } = this.state;
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);
    if (prevState.page !== page || prevState.issueState !== issueState) {
      const response = await api.get(`/repos/${repoName}/issues`, {
        params: {
          state: issueState,
          per_page: 10,
          page,
        },
      });
      this.setState({ issues: response.data });
    }
  }

  /* handleView = event => {
    const { issues } = this.state;
    const click = event.target.value;
    if (click !== 'all') {
      const newss = issues.filter(item => {
        return item.state === click;
      });
      this.setState({ filtered: newss });
    } else {
      this.setState({ filtered: issues });
    }
  }; */

  render() {
    const { repository, loading, issues, page } = this.state;
    if (loading) {
      return <Loading>Carregando</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos Repositorios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <FilterList>
          <button
            type="button"
            onClick={() => this.setState({ issueState: 'open', page: 1 })}
            value="open"
          >
            Open
          </button>
          <button
            onClick={() => this.setState({ issueState: 'all', page: 1 })}
            type="button"
          >
            All
          </button>
          <button
            onClick={() => this.setState({ issueState: 'closed', page: 1 })}
            value="closed"
            type="button"
          >
            Closed
          </button>
        </FilterList>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Pagination>
          <button
            type="button"
            disabled={page === 1}
            onClick={() => this.setState({ page: page - 1 })}
          >
            Pagina Anterior
          </button>
          <button type="button" onClick={() => this.setState({ page: 1 })}>
            Pagina Inicial
          </button>
          <button
            type="button"
            onClick={() => this.setState({ page: page + 1 })}
          >
            Proxima Pagina
          </button>
        </Pagination>
      </Container>
    );
  }
}
